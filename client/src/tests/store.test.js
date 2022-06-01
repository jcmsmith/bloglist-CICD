import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch } from "react-redux";

import { createTimer } from "../reducers/timerReducer";
import { createMessage, createErrorMsg } from "../reducers/notificationReducer";

describe("messageReducer", () => {
  test("returns proper initial state", () => {});
});
