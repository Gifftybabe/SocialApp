const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("You can only update your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("You can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like /dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
// router.get("/timeline/:userId", async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.params.userId);

//     if (!currentUser) {
//       console.error(`User not found for ID: ${req.params.userId}`);
//       return res.status(404).json({ error: "User not found" });
//     }

//     console.log(
//       `Request received for timeline posts. Current User ID: ${currentUser._id}`
//     );

//     const userPosts = await Post.find({ userId: currentUser._id });

//     console.log(
//       `Found ${userPosts.length} posts for User ID: ${currentUser._id}`
//     );

//     const friendPosts = await Promise.all(
//       currentUser.followings.map((friendId) => {
//         // return Post.find({ userId: friendId });
//         console.log(
//           `Found ${friendPosts.length} posts for Friend ID: ${friendId}`
//         );
//         return friendPosts;
//       })
//     );
//     //     res.status(200).json(userPosts.concat(...friendPosts));
//     //   } catch (err) {
//     //     res.status(500).json(err);
//     //   }
//     // });
//     const allPosts = userPosts.concat(...friendPosts);
//     res.status(200).json(allPosts);
//   } catch (err) {
//     console.error("Error fetching timeline posts:", err);
//     res.status(500).json(err);
//   }
// });

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    console.log("Found user:", user);
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    console.log("Error fetching user or posts:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
