import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

import Users from "./Users";

const UserList = () => {
  const titleMargin = {
    marginTop: 20,
    marginBottom: 0,
  };

  return (
    <div>
      <h2 style={titleMargin}>Users</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <h3>Name</h3>
              </TableCell>
              <TableCell>
                <h3>Blogs added</h3>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Users />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
