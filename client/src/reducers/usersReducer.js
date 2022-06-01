import { createSlice } from "@reduxjs/toolkit";

import store from "../store";
import { setToken } from "../services/blogs";
import { getAll, create } from "../services/users";

const initialUser = { username: "", name: "", id: "", token: null };

const initialState = [{ users: [] }, { currentUser: initialUser }];

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    allUsers(state, action) {
      const newState = [{ users: action.payload }, state[1]];
      return newState;
    },
    currentUser(state, action) {
      if (action.payload === null) {
        return [state[0], { currentUser: initialUser }];
      }

      const newState = [state[0], { currentUser: action.payload }];
      return newState;
    },
    updateUser(state, action) {
      const updatedUser = state[0].users.map((user) => {
        if (user.id === action.payload.id) {
          return action.payload;
        }
        return user;
      });
      //console.log("updatedUser", updatedUser);

      const newState = [{ users: [...updatedUser] }, state[1]];
      //console.log("newState", newState);
      return newState;
    },
  },
});

export const fetchAllUsers = () => {
  return async (dispatch) => {
    const users = await getAll();
    dispatch(allUsers(users));
  };
};

export const checkIfLoggedIn = () => {
  return (dispatch) => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setToken(user.token);
      dispatch(currentUser(user));
    } else {
      dispatch(currentUser(initialUser));
    }
  };
};

export const setCurrentUser = (user) => {
  return (dispatch) => {
    dispatch(currentUser(user));
  };
};

export const removeBlogFromUser = (blogId) => {
  return async (dispatch) => {
    // I know there are many easier ways to do this, but I'm getting pretty good with map and filter!!
    const users = await store.getState().users[0].users;
    //console.log("users", users);
    const userWithBlog = users.filter((user) => {
      const blogIds = user.blogs.map((blog) => blog.id);
      const checkForMatch = blogIds.filter((id) => id === blogId);
      //console.log("blogIds", blogIds);
      //console.log("match", checkForMatch);
      return checkForMatch;
    });
    //console.log("userWithBlog", userWithBlog);
    const userBlogs = userWithBlog[0].blogs;
    //console.log("userblogs", userBlogs);
    const removed = userBlogs.filter((blog) => blog.id !== blogId);
    //console.log("remove", removed);
    const userWithoutBlog = { ...userWithBlog[0], blogs: removed };
    //console.log("w/o", userWithoutBlog);
    dispatch(updateUser(userWithoutBlog));
  };
};

export const { allUsers, currentUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
