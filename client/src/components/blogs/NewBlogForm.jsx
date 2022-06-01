import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createMessage,
  createErrorMsg,
} from "../../reducers/notificationReducer";
import { addBlog } from "../../reducers/blogsReducer";
import { useNavigate } from "react-router-dom";

const NewBlogForm = ({ user }) => {
  const blankBlog = { title: "", author: "", url: "" };

  const [newBlog, setNewBlog] = useState(blankBlog);
  const blogs = useSelector((state) => state.blogs);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let title = newBlog.title;
  let author = newBlog.author;
  let url = newBlog.url;

  const newBlogChange = (changedProperty, value) => {
    if (changedProperty === "title") {
      title = value;
    }

    if (changedProperty === "author") {
      author = value;
    }

    if (changedProperty === "url") {
      url = value;
    }

    setNewBlog({ title, author, url });
  };

  const createBlog = (event) => {
    event.preventDefault();

    if (newBlog.title.length <= 3) {
      dispatch(createErrorMsg("Title is too short!"));
      return;
    }

    const blogMatch = blogs.filter((blog) => {
      return blog.title.toLowerCase() === newBlog.title.toLowerCase();
    });

    if (blogMatch && blogMatch.length > 0) {
      dispatch(createMessage("Existing blog found, please change title"));
      return;
    }

    const blog = {
      title,
      author,
      url,
    };

    dispatch(addBlog(blog, user));

    dispatch(createMessage(`Posting new blog: ${title}, ${author}, ${url}`));

    setNewBlog(blankBlog);
    navigate("/blogs");
  };

  return (
    <>
      <h2>Post a new blog</h2>
      <form onSubmit={createBlog} className={"new-blog-form"}>
        <p>Title</p>
        <input
          value={newBlog.title}
          onChange={({ target }) => newBlogChange("title", target.value)}
          placeholder="Title"
          data-cy="newblog-titleinput"
        />
        <p>Author</p>
        <input
          value={newBlog.author}
          onChange={({ target }) => newBlogChange("author", target.value)}
          placeholder="Author"
          data-cy="newblog-authorinput"
        />
        <p>URL</p>
        <input
          value={newBlog.url}
          onChange={({ target }) => newBlogChange("url", target.value)}
          placeholder="URL"
          data-cy="newblog-urlinput"
        />
        <br />
        <button
          type="submit"
          id="save-blog-button"
          data-cy="newblog-save-button"
        >
          save
        </button>
      </form>
    </>
  );
};

export default NewBlogForm;
