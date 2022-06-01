const mongoose = require("mongoose");
const supertest = require("supertest");

const helper = require("./test_helper");
const Blog = require("../models/blog");
const app = require("../app");
const User = require("../models/user");
const api = supertest(app);

const loginAsUser = async (username = "", password = "") => {
  let user = {
    username: username,
    password: password,
  };

  if (username === "" && password === "") {
    user = {
      username: "root",
      password: "$ecretPW427",
    };
  }

  const login = await api.post("/api/login").send(user).expect(200);

  return login._body.token;
};

beforeAll(async () => {
  await User.deleteMany({});

  return await helper.createRootUser();
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogs = await helper.initialBlogs;

  for (let blog of blogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("When there are some initial blogs saved", () => {
  test("they are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("they are all returned", async () => {
    const blogs = await helper.blogsInDb();

    expect(blogs).toHaveLength(helper.initialBlogs.length);
  }, 100000);

  test("they are returned with id, and no _id or __v properties", async () => {
    const blogs = await helper.blogsInDb();

    expect(blogs[0].id).toBeDefined();
    expect(blogs[0]._id).toBeUndefined();
    expect(blogs[0].__v).toBeUndefined();
  }, 100000);

  test("one of them was written by Testy McTesterson", async () => {
    const blogs = await helper.blogsInDb();

    const contents = blogs.map((blog) => blog.author);

    expect(contents).toContainEqual("Testy McTesterson");
  }, 100000);

  test("they were created by the root user", async () => {
    const rootId = await helper.rootUserId();
    const blogs = await helper.blogsInDb();

    const ids = blogs.map((blog) => blog.user.toJSON());

    expect(ids).toContainEqual(rootId);
  });
});

describe("Adding a new blog", () => {
  test("will fail with status code 401 if token is not provided", async () => {
    await api.post("/api/blogs").expect(401);

    const blogsAfterPost = await helper.blogsInDb();
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length);
  });

  test("will add the user id to the blog", async () => {
    const token = await loginAsUser();

    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    };

    const returnedBlog = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const returnedUser = returnedBlog._body.user;

    const rootId = await helper.rootUserId();

    expect(returnedUser).toBeDefined();
    expect(returnedUser).toEqual(rootId);
  });

  test("will increase the size of db by one", async () => {
    const token = await loginAsUser();

    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfterPost = await helper.blogsInDb();
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAfterPost.map((blog) => blog.title);
    expect(titles).toContainEqual("React patterns");
  }, 100000);

  test("without the likes property will default to likes:0", async () => {
    const token = await loginAsUser();

    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfterPost = await helper.blogsInDb();

    const posted = blogsAfterPost.filter(
      (blog) => blog.title === "React patterns"
    );
    expect(posted[0].likes).toBe(0);
  }, 100000);

  test("without the title and url properties will not add it to db, and will return status 400", async () => {
    const token = await loginAsUser();

    const newBlog = {
      author: "Michael Chan",
      likes: 17,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${token}`)
      .expect(400);

    const blogsAfterPost = await helper.blogsInDb();
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length);
  }, 100000);
});

describe("Viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const startingBlogs = await helper.blogsInDb();

    const blogToView = startingBlogs[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedBlog = JSON.parse(JSON.stringify(blogToView));

    expect(resultBlog.body).toEqual(processedBlog);
  }, 100000);

  test("fails with status code 404 if blog does not exist", async () => {
    const fakeId = await helper.invalidId();

    await api.get(`/api/blogs/${fakeId}`).expect(404);
  }, 100000);

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "798l098dg939l0913os9234";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  }, 100000);
});

describe("Deleting a single blog", () => {
  test("succeeds with status code 204 if id is valid and user is correct", async () => {
    const startingBlogs = await helper.blogsInDb();
    const blogToDelete = startingBlogs[0];

    const token = await loginAsUser();

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(204);

    const blogsAfterDelete = await helper.blogsInDb();
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAfterDelete.map((blog) => blog.title);
    expect(titles).not.toContainEqual(blogToDelete.title);
  }, 100000);

  test("fails with status code 401 if the wrong user is attempting to delete", async () => {
    const startingBlogs = await helper.blogsInDb();
    const blogToDelete = startingBlogs[0];

    const username = "newUser108942";
    const password = "somePassword92418";

    await helper.createUser(username, password);
    const token = await loginAsUser(username, password);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(401);

    const blogsAfterDelete = await helper.blogsInDb();
    expect(blogsAfterDelete).toHaveLength(startingBlogs.length);
  });

  test("returns status code 404 without changing db if blog does not exist", async () => {
    const fakeId = await helper.invalidId();

    const token = await loginAsUser();

    await api
      .delete(`/api/blogs/${fakeId}`)
      .set("Authorization", `bearer ${token}`)
      .expect(404);

    const blogsAfterDelete = await helper.blogsInDb();
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length);
  });
});

describe("Updating a blog", () => {
  test("succeeds when updating likes only", async () => {
    const startingBlogs = await helper.blogsInDb();
    const oldBlog = startingBlogs[0];

    const newBlog = { ...oldBlog, likes: oldBlog.likes + 50 };

    await api
      .put(`/api/blogs/${oldBlog.id}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAfterUpdate = await helper.blogsInDb();
    const updatedBlog = blogsAfterUpdate.filter(
      (blog) => blog.title === oldBlog.title
    )[0];

    expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length);
    expect(blogsAfterUpdate).toContainEqual(newBlog);
    expect(updatedBlog.title).toEqual(oldBlog.title);
    expect(updatedBlog.likes).toEqual(oldBlog.likes + 50);
  });

  test("succeeds when updating title only", async () => {
    const startingBlogs = await helper.blogsInDb();
    const oldBlog = startingBlogs[0];

    const newBlog = { ...oldBlog, title: "A new title" };

    await api
      .put(`/api/blogs/${oldBlog.id}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAfterUpdate = await helper.blogsInDb();
    const updatedBlog = blogsAfterUpdate.filter(
      (blog) => blog.author === oldBlog.author
    )[0];

    expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length);
    expect(blogsAfterUpdate).toContainEqual(newBlog);

    expect(updatedBlog.title).not.toEqual(oldBlog.title);
  });

  test("succeeds when updating author only", async () => {
    const startingBlogs = await helper.blogsInDb();
    const oldBlog = startingBlogs[0];

    const newBlog = { ...oldBlog, author: "A new author" };

    await api
      .put(`/api/blogs/${oldBlog.id}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAfterUpdate = await helper.blogsInDb();
    const updatedBlog = blogsAfterUpdate.filter(
      (blog) => blog.title === oldBlog.title
    )[0];

    expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length);
    expect(blogsAfterUpdate).toContainEqual(newBlog);

    expect(updatedBlog.author).not.toEqual(oldBlog.author);
  });

  test("succeeds when updating url only", async () => {
    const startingBlogs = await helper.blogsInDb();
    const oldBlog = startingBlogs[0];

    const newBlog = { ...oldBlog, url: "newurl.com" };

    await api
      .put(`/api/blogs/${oldBlog.id}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAfterUpdate = await helper.blogsInDb();
    const updatedBlog = blogsAfterUpdate.filter(
      (blog) => blog.title === oldBlog.title
    )[0];

    expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length);
    expect(blogsAfterUpdate).toContainEqual(newBlog);

    expect(updatedBlog.url).not.toEqual(oldBlog.url);
  });

  test("fails with status code 404 if old blog does not exist", async () => {
    const startingBlogs = await helper.blogsInDb();
    const fakeId = await helper.invalidId();

    await api.put(`/api/blogs/${fakeId}`).expect(404);

    const blogsAfterUpdate = await helper.blogsInDb();
    expect(blogsAfterUpdate).toEqual(startingBlogs);
  });

  test("fails with status code 400 if new blog does not contain title and url", async () => {
    const startingBlogs = await helper.blogsInDb();
    const oldBlog = startingBlogs[0];

    const newBlog = { author: "some dude", likes: 99 };

    await api.put(`/api/blogs/${oldBlog.id}`).send(newBlog).expect(400);

    const blogsAfterUpdate = await helper.blogsInDb();

    expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length);
    expect(blogsAfterUpdate).toContainEqual(oldBlog);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
