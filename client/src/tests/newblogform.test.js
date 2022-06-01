import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewBlogForm from "../components/NewBlogForm";

test("correctly calls the event handler passed to it, with the right properties", async () => {
  const mockPostNewBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<NewBlogForm postNewBlog={mockPostNewBlog} />);

  const titleInput = screen.getByPlaceholderText("Title");
  const authorInput = screen.getByPlaceholderText("Author");
  const urlInput = screen.getByPlaceholderText("URL");
  const saveButton = container.querySelector("#save-blog-button");

  await user.type(titleInput, "title goes here");
  await user.type(authorInput, "author goes here");
  await user.type(urlInput, "urlgoeshere.com");
  await user.click(saveButton);

  const saveResults = mockPostNewBlog.mock.calls;

  expect(saveResults).toHaveLength(1);
  expect(saveResults[0][0].title).toBe("title goes here");
  expect(saveResults[0][0].author).toBe("author goes here");
  expect(saveResults[0][0].url).toBe("urlgoeshere.com");
});
