const supertest = require("supertest");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();

  const blogs = helper.initialBlogs;

  for (let blog of blogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

it("reset endpoint should reset db", async () => {
  const blogsAtStart = await Blog.find({});
  expect(blogsAtStart).toHaveLength(helper.initialBlogs.length);

  const usersAtStart = await User.find({});
  expect(usersAtStart).toHaveLength(1);

  await api.post("/api/testing/reset").expect(204);

  const blogsNow = await Blog.find({});
  expect(blogsNow).toHaveLength(0);

  const usersNow = await User.find({});
  expect(usersNow).toHaveLength(0);
});

it("ping and healthcheck endpoints should both work", async () => {
  await api.get("/api/ping/").expect(200);

  await api.get("/api/ping/health/").expect(200);
});
