import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  const sortBy = query.sortBy || "datePublished";

  let orderBy;
  if (sortBy === "priceHigh") {
    orderBy = { price: "desc" };
  } else if (sortBy === "priceLow") {
    orderBy = { price: "asc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
        acquired: false,  // Exclude acquired posts
      },
      orderBy: orderBy,
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to get posts" });
    }
  }
}


export const acquirePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userId === tokenUserId) {
      return res.status(400).json({ message: "Cannot acquire your own post!" });
    }

    await prisma.post.update({
      where: { id: postId },
      data: { acquired: true, acquiredBy: tokenUserId },
    });

    res.status(200).json({ message: "Post acquired successfully" });
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to acquire post!" });
    }
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: { username: true, avatar: true },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: { postId: id, userId: payload.id },
            },
          });
          if (!res.headersSent) {
            res.status(200).json({ ...post, isSaved: saved ? true : false });
          }
        } else if (!res.headersSent) {
          res.status(200).json({ ...post, isSaved: false });
        }
      });
    } else {
      if (!res.headersSent) {
        res.status(200).json({ ...post, isSaved: false });
      }
    }
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to get post" });
    }
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to create post" });
    }
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: body,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to update post!" });
    }
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true }
    });

    if (!post) {
      console.error(`Post with ID ${id} not found.`);
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userId !== tokenUserId) {
      console.error(`User ${tokenUserId} can not delete post with ID ${id}.`);
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // First, delete the related PostDetail if it exists
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { id: post.postDetail.id }
      });
    }

    // Then, delete the post
    await prisma.post.delete({
      where: { id }
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err); 
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to delete post!" });
    }
  }
};
