import { configureStore } from "@reduxjs/toolkit";

import notificationSlice from "./reducers/notificationReducer";
import timerSlice from "./reducers/timerReducer";
import blogSlice from "./reducers/blogsReducer";
import userSlice from "./reducers/usersReducer";

const store = configureStore({
  reducer: {
    notification: notificationSlice,
    timer: timerSlice,
    blogs: blogSlice,
    users: userSlice,
  },
});

export default store;
