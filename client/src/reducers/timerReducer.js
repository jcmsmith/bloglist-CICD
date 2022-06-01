import { createSlice } from "@reduxjs/toolkit";

import store from "../store";
import { clearNotification } from "./notificationReducer";

const initialState = { id: null };

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setTimer(state, action) {
      return { id: action.payload };
    },
    clearTimer(state, action) {
      return initialState;
    },
  },
});

export const createTimer = (time) => {
  return (dispatch) => {
    const id = store.getState().timer.id;
    if (id !== null) {
      clearTimeout(id);
      dispatch(clearTimer());
    }

    const newId = setTimeout(() => {
      dispatch(clearTimer());
      dispatch(clearNotification());
    }, time * 1000);

    dispatch(setTimer(newId));
  };
};

export const { setTimer, clearTimer } = timerSlice.actions;

export default timerSlice.reducer;
