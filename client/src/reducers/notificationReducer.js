import { createSlice } from "@reduxjs/toolkit";

import { createTimer } from "./timerReducer";

const initialState = { message: "", isError: false };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setMessage(state, action) {
      return {
        message: action.payload,
        isError: false,
      };
    },
    setError(state, action) {
      return {
        message: action.payload,
        isError: true,
      };
    },
    clearNotification(state, action) {
      return initialState;
    },
  },
});

export const createMessage = (text, time = 5) => {
  return (dispatch) => {
    dispatch(setMessage(text));
    dispatch(createTimer(time));
  };
};

export const createErrorMsg = (text, time = 5) => {
  return (dispatch) => {
    dispatch(setError(text));
    dispatch(createTimer(time));
  };
};

export const { setMessage, setError, clearNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
