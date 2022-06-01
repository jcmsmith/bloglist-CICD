import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, IconButton, Button, Toolbar } from "@mui/material";

import { createMessage } from "../reducers/notificationReducer";
import { setCurrentUser } from "../reducers/usersReducer";

import { setToken } from "../services/blogs";

import Message from "./Message";

const Header = () => {
  const margin = {
    marginLeft: 10,
    marginRight: 10,
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users[1].currentUser);

  const handleLogout = (event) => {
    event.preventDefault();

    dispatch(createMessage(`See you later, ${user.name}!`));
    setToken(null);
    window.localStorage.removeItem("loggedInUser");
    dispatch(setCurrentUser(null));
    navigate("/login");
  };

  return (
    <div>
      <div>
        <h2>My Bloglist App</h2>
        <Message />
      </div>
      {user.token !== null ? (
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" />
              <Button color="inherit" component={Link} to="/blogs">
                blogs
              </Button>
              <Button color="inherit" component={Link} to="/users">
                users
              </Button>

              <div>
                <em data-cy="loggedin-as-msg">Logged in as:</em>
                {user.name}
                <button onClick={handleLogout} style={margin}>
                  Logout
                </button>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
