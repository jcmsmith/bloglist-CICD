import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Blog from "../components/Blog";

test("renders only blog title by default", () => {
  const blog = {
    title: "This blog is being tested",
    author: "A Human",
    url: "Testsite.xyz",
    likes: 4129,
  };

  const { container } = render(<Blog blog={blog} />);

  const minimal = container.querySelector(".minimal");
  const expanded = container.querySelector(".expanded");
  const likes = screen.queryByText("likes:");
  const url = screen.queryByText("URL:");

  expect(minimal).not.toHaveStyle("display: none");
  expect(expanded).toHaveStyle("display: none");
  expect(likes).toBeNull();
  expect(url).toBeNull();
});

test("clicking the toggle details button once expands blog details", async () => {
  const blog = {
    title: "This blog is being tested",
    author: "A Human",
    url: "Testsite.xyz",
    likes: 4129,
  };

  const { container } = render(<Blog blog={blog} />);

  const minimal = container.querySelector(".minimal");
  const expanded = container.querySelector(".expanded");
  const likes = screen.queryByText("likes:");
  const url = screen.queryByText("URL:");

  const showDetailsButton = container.querySelector("#show-details");
  const user = userEvent.setup();

  await user.click(showDetailsButton);

  expect(minimal).toHaveStyle("display: none");
  expect(expanded).not.toHaveStyle("display: none");
  expect(likes).toBeDefined();
  expect(url).toBeDefined();
});

test("clicking the like button twice calls the correct event handler twice", async () => {
  const blog = {
    title: "This blog is being tested",
    author: "A Human",
    url: "Testsite.xyz",
    likes: 4129,
  };

  const mockLikeBlog = jest.fn();

  const { container } = render(<Blog blog={blog} likeBlog={mockLikeBlog} />);

  const likeButton = container.querySelector("#like-button");
  const user = userEvent.setup();

  await user.click(likeButton);
  expect(mockLikeBlog.mock.calls).toHaveLength(1);
  await user.click(likeButton);
  expect(mockLikeBlog.mock.calls).toHaveLength(2);
});
