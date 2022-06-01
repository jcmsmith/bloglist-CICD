import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Divider,
  ListItemText,
} from "@mui/material";

import { deleteBlog } from "../../reducers/blogsReducer";

const Blog = ({ blog, deleteAllowed }) => {
  const dispatch = useDispatch();
  const showDeleteButton = { display: deleteAllowed ? "" : "none" };

  const handleDeleteButton = (event) => {
    event.preventDefault();

    if (window.confirm("Are you sure you wish to delete this blog?")) {
      dispatch(deleteBlog(blog.id));
    }
  };

  return (
    <>
      <ListItemButton component={Link} to={`${blog.id}`}>
        <ListItemText primary={blog.title}>
          <Link to={`${blog.id}`}></Link>
        </ListItemText>
      </ListItemButton>

      <div style={showDeleteButton}>
        <button onClick={handleDeleteButton}>delete</button>
      </div>
    </>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default Blog;
