import { TableCell, TableRow } from "@mui/material";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

const Users = () => {
  const users = useSelector((state) => state.users[0].users);

  const getTotalBlogs = (user) => {
    const initialValue = 0;
    const total = user.blogs.reduce((previous, current) => {
      return (previous += 1);
    }, initialValue);

    return total;
  };

  return (
    <>
      {users.map((user) => {
        return (
          <TableRow key={user.id}>
            <TableCell>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </TableCell>
            <TableCell>{getTotalBlogs(user)}</TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default Users;
