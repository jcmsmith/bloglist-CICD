const blogsRouter = require("express").Router();
const { userExtractor } = require("../utils/middleware");
const { isUndefined } = require("lodash");
const Blog = require("../models/blog");
const User = require("../models/user");

// Base URL: /api/blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const specifiedBlog = await Blog.findById(request.params.id);

  if (specifiedBlog) {
    response.json(specifiedBlog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;

  if (isUndefined(body.title) && isUndefined(body.url)) {
    return response.status(400).json({ error: "missing title and URL" });
  }

  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(request.user);

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const post = await newBlog.save();
  user.blogs = user.blogs.concat(post._id);
  await user.save();
  response.status(201).json(post);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  let comment = request.body.comment;
  console.log("comment", comment, typeof comment);

  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).json({ error: `No blog found at id ${id}` });
  }

  let newBlog;

  if (blog.comments === undefined) {
    newBlog = { ...blog._doc, comments: [comment] };
  } else {
    newBlog = { ...blog._doc, comments: blog.comments.concat(comment) };
  }

  console.log("new", newBlog);

  const update = await Blog.findByIdAndUpdate(id, newBlog);
  response.status(201).json(update);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blogToDelete = request.params.id;

  const blog = await Blog.findById(blogToDelete);

  if (!blog) {
    return response.status(404).json({ error: "No blog found to delete!" });
  }

  const blogId = blog.user.toString();

  if (request.user === blogId) {
    await Blog.findByIdAndDelete(blogToDelete);
    response.status(204).end();
  }

  response.status(401).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const idMatch = await Blog.findById(request.params.id);

  if (!idMatch) {
    return response.status(404).end();
  }

  const newBlog = request.body;

  if (isUndefined(newBlog.title) && isUndefined(newBlog.url)) {
    return response.status(400).send({ error: "Missing title and URL!" });
  }

  const update = await Blog.findByIdAndUpdate(request.params.id, newBlog);
  response.status(200).json(update);
});

module.exports = blogsRouter;
