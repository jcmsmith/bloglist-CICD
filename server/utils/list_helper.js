const lodash = require("lodash");

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  if (!Array.isArray(blogs)) return null;
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;

  const total = blogs.reduce((previousLikes, currentBlog) => {
    return previousLikes + currentBlog.likes;
  }, 0);

  return total;
};

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs)) return null;
  if (blogs.length === 0) return null;
  if (blogs.length === 1) return blogs[0];

  let currentMostLikes = 0;
  let currentFavorite = null;

  blogs.map((blog) => {
    if (blog.likes >= currentMostLikes) {
      currentMostLikes = blog.likes;
      currentFavorite = blog;
    }
  });

  return currentFavorite;
};

// From a list, find the author with the most blogs written
const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs)) return null;
  if (blogs.length === 0) return null;

  if (blogs.length === 1) {
    return { author: blogs[0].author, blogs: 1 };
  }

  const count = lodash.countBy(blogs, "author");

  let mostWritten = 0;
  let mostProlific = null;

  lodash.forEach(count, (count, author) => {
    if (count >= mostWritten) {
      mostWritten = count;
      mostProlific = author;
    }
  });

  const result = { author: mostProlific, blogs: mostWritten };

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
