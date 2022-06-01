import { useSelector } from "react-redux";
import { Box, List, ListItem, Divider } from "@mui/material";

import Blog from "./Blog";
import { Link } from "react-router-dom";

const BlogList = ({ userId }) => {
  const blogs = useSelector((state) => state.blogs);
  if (!blogs) {
    return null;
  }

  return (
    <div>
      <h2>Blog List</h2>
      <Link to={`/blogs/new`}>Add new</Link>
      <br />
      <List>
        {blogs.map((blog) => (
          <Box
            key={blog.id}
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <ListItem disablePadding>
              <Blog blog={blog} deleteAllowed={userId === blog.user.id} />
            </ListItem>
            <br />
            <Divider />
          </Box>
        ))}
      </List>
    </div>
  );
};

export default BlogList;
