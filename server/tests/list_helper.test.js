const listHelper = require("../utils/list_helper");
const logger = require("../utils/logger");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

describe("Total likes", () => {
  test("of non-list inputs should be null", () => {
    let result = listHelper.totalLikes(5);
    expect(result).toBeNull();

    result = listHelper.totalLikes({ test: 14, something: "beans" });
    expect(result).toBeNull();

    result = listHelper.totalLikes("string");
    expect(result).toBeNull();
  });

  test("of list with one blog should be equal to its likes", () => {
    const testBlog = [blogs[0]];
    const result = listHelper.totalLikes(testBlog);
    expect(result).toBe(7);
  });

  test("of list with multiple blogs should be an accurate total", () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe("Favorite blog", () => {
  test("from non-list inputs should be null", () => {
    let result = listHelper.favoriteBlog(24);
    expect(result).toBeNull();

    result = listHelper.favoriteBlog("some words");
    expect(result).toBeNull();

    result = listHelper.favoriteBlog({ "some object": "some property" });
    expect(result).toBeNull();
  });

  test("from list with one blog should be that blog", () => {
    const testBlog = [blogs[2]];
    const expected = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    };

    const result = listHelper.favoriteBlog(testBlog);

    expect(result).toEqual(expected);
  });

  test("from list of many blogs should be the one with most likes", () => {
    const expected = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    };

    const result = listHelper.favoriteBlog(blogs);

    expect(result).toEqual(expected);
  });
});

describe("Most blogs", () => {
  test("from list with one blog should be an object with author: author and blogs: 1", () => {
    const expected = {
      author: "Michael Chan",
      blogs: 1,
    };

    const result = listHelper.mostBlogs([blogs[0]]);

    expect(result).toEqual(expected);
  });

  test("from list with many blogs should be an object with the most prolific author and accurate count", () => {
    const expected = {
      author: "Robert C. Martin",
      blogs: 3,
    };

    const result = listHelper.mostBlogs(blogs);

    expect(result).toEqual(expected);
  });
});
