const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  }); // The "1" value refers to the number of values from that parameter to return

  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const userId = request.body;
  const user = await User.find({ user: userId }).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  response.json(user);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (username.length <= 3) {
    return response.status(400).json({
      error: "Username must be 3 or more characters in length",
    });
  }

  if (password.length <= 5) {
    return response.status(400).json({
      error: "Password must be 5 or more characters in length",
    });
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return response.status(400).json({
      error: "Username must be unique",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
