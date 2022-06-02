import { useSelector } from "react-redux";
import { Box, List, ListItem, Divider } from "@mui/material";

import Blog from "./Blog";
import { Link } from "react-router-dom";

const BlogList = ({ userId }) => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div>
      <h2>Blog List</h2>
      <Link to={`/blogs/new`} data-cy="newblog-button">
        Add new
      </Link>
      <br />
      {blogs !== null ? (
        <List>
          {blogs.map((blog) => (
            <Box
              key={blog.id}
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              <ListItem disablePadding data-cy="blog-minimal">
                <Blog blog={blog} deleteAllowed={userId === blog.user.id} />
              </ListItem>
              <br />
              <Divider />
            </Box>
          ))}
        </List>
      ) : null}
    </div>
  );
};

export default BlogList;
