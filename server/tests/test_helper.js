const bcrypt = require("bcrypt");
const { isNull } = require("lodash");

const Blog = require("../models/blog");
const User = require("../models/user");

let rootUser = null;

const createRootUser = async () => {
  const passwordHash = await bcrypt.hash("$ecretPW427", 10);
  const root = new User({ username: "root", passwordHash, blogs: [] });

  await root.save();

  rootUser = await User.findOne({ username: "root" });

  initialBlogs.concat(initialBlogs.map((blog) => (blog.user = rootUser.id)));

  return rootUser;
};

const rootUserId = async () => {
  if (isNull(rootUser)) {
    await createRootUser();
  }

  return rootUser.id;
};

const createUser = async (username, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username: username, passwordHash, blogs: [] });

  await user.save();

  const newUser = await User.findOne({ username });

  return newUser;
};

const setInitialBlogsOwner = async (username) => {
  const user = await User.findOne({ username });
  user.blogs = initialBlogs;
  initialBlogs.concat(initialBlogs.map((blog) => (blog.user = rootUser.id)));
};

const deleteUser = async (username) => {
  const user = await User.findOne({ username });
  await User.findByIdAndDelete(user.id);
};

const initialBlogs = [
  {
    title: "To Test or Not to Test",
    author: "Testy McTesterson",
    url: "test.com/test",
    likes: 15,
  },
  {
    title: "Bananas",
    author: "Testy McTesterson II",
    url: "test.com/bananas",
    likes: 42,
  },
];

const invalidId = async () => {
  const blog = new Blog({
    title: "somethingthatdoesntmatter",
    author: "somehumanidkdeletethis",
    url: "fakeurlgoeshere",
    likes: 98,
  });

  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  invalidId,
  blogsInDb,
  usersInDb,
  createRootUser,
  rootUserId,
  createUser,
  setInitialBlogsOwner,
  deleteUser,
};
