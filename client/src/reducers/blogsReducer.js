import { createSlice } from "@reduxjs/toolkit";

import { getAll, create, update, del, comment } from "../services/blogs";
import { removeBlogFromUser } from "./usersReducer";

const sortByLikes = (blogs) => {
  const sorted = blogs.sort((blog1, blog2) => {
    if (blog1.likes === blog2.likes) {
      return 0;
    }

    return blog1.likes > blog2.likes ? -1 : 1;
  });

  return sorted;
};

const initialState = [];

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    initialize(state, action) {
      return sortByLikes(action.payload);
    },
    add(state, action) {
      const newState = state.concat(action.payload);
      return sortByLikes(newState);
    },
    change(state, action) {
      const filtered = state.filter((blog) => blog.id !== action.payload.id);
      const newState = filtered.concat(action.payload);
      return sortByLikes(newState);
    },
    remove(state, action) {
      const filtered = state.filter((blog) => blog.id !== action.payload);
      return sortByLikes(filtered);
    },
  },
});

export const fetchAllBlogs = () => {
  return async (dispatch) => {
    const blogs = await getAll();

    dispatch(initialize(blogs));
  };
};

export const addBlog = (blog, user) => {
  return async (dispatch) => {
    const post = await create(blog);
    const likes = post.likes === undefined ? 0 : post.likes;

    const addedBlog = {
      ...blog,
      likes,
      id: post.id,
      user: {
        username: user.username,
        name: user.name,
        id: post.user,
      },
    };

    dispatch(add(addedBlog));
  };
};

export const updateBlog = (blog) => {
  return async (dispatch) => {
    const blogToPost = {
      ...blog,
      user: blog.user.id,
    };

    await update(blogToPost);

    dispatch(change(blog));
  };
};

export const addComment = (blog, newComment) => {
  return async (dispatch) => {
    await comment(blog.id, newComment);
    const newBlog = {
      ...blog,
      comments: [...blog.comments, newComment],
    };

    dispatch(change(newBlog));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await del(id);
    dispatch(removeBlogFromUser(id));
    dispatch(remove(id));
  };
};

export const { initialize, add, change, remove } = blogSlice.actions;
export default blogSlice.reducer;
