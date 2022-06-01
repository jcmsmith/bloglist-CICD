import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { Box, List, ListItem, Divider } from "@mui/material";

import { updateBlog, addComment } from "../../reducers/blogsReducer";

const BlogInfo = () => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const dispatch = useDispatch();

  const params = useParams();
  const blog = useSelector((state) => {
    const b = state.blogs.filter((blog) => blog.id === params.id);
    return b[0];
  });

  if (!blog) {
    return null;
  }

  const handleLikeButton = (event) => {
    event.preventDefault();

    const likedBlog = { ...blog, likes: blog.likes + 1 };
    dispatch(updateBlog(likedBlog));
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();

    dispatch(addComment(blog, commentInput));
    setCommentInput("");
    setShowCommentForm(false);
  };

  const infoBoxStyle = {
    paddingLeft: 2,
    border: "solid",
    borderWidth: 5,
    paddingBottom: 10,
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
  };

  const centerBoxStyle = {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
  };

  const commentFormStyle = {
    display: showCommentForm ? "" : "none",
  };

  return (
    <>
      <br />
      <div style={infoBoxStyle}>
        <h2>&quot;{blog.title}&quot;</h2>
        <h3>Author: {blog.author}</h3>
        <p>Link: {blog.url}</p>
        <div>
          <p>
            {blog.likes} likes <button onClick={handleLikeButton}>Like</button>
          </p>
        </div>
        <p>Added by: {blog.user.name}</p>
      </div>
      <div>
        <br />
        <div style={centerBoxStyle}>
          <button onClick={() => setShowCommentForm(!showCommentForm)}>
            Add comment
          </button>
          <div style={commentFormStyle}>
            <form onSubmit={handleSubmitComment}>
              <input
                value={commentInput}
                onChange={({ target }) => setCommentInput(target.value)}
                placeholder="comment"
              />
              <button type="submit">submit</button>
            </form>
          </div>
          <h2>Comments:</h2>
        </div>
        {blog.comments !== undefined && blog.comments ? (
          <List>
            {blog.comments.map((comment) => {
              return (
                <Box key={nanoid()}>
                  <ListItem>{comment}</ListItem>
                  <Divider />
                </Box>
              );
            })}
          </List>
        ) : (
          <p>No comments yet!</p>
        )}
      </div>
    </>
  );
};

export default BlogInfo;
