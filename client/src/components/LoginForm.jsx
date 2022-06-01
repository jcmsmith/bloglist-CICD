import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

import { setToken } from "../services/blogs";

import { createMessage, createErrorMsg } from "../reducers/notificationReducer";
import { setCurrentUser } from "../reducers/usersReducer";

import login from "../services/login";

const LoginForm = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Attempting to log in as", usernameInput);

    try {
      const user = await login({
        username: usernameInput,
        password: passwordInput,
      });

      window.localStorage.setItem("loggedInUser", JSON.stringify(user));

      setToken(user.token);
      console.log("logged in as ", usernameInput);

      setUsernameInput("");
      setPasswordInput("");

      dispatch(setCurrentUser(user));

      navigate("/blogs");

      dispatch(createMessage(`Welcome, ${user.name}!`));
    } catch (exception) {
      console.log(exception);
      dispatch(createErrorMsg("Invalid username or password!"));
    }
  };

  const handleUsernameInput = (username) => {
    setUsernameInput(username);
  };

  const handlePwInput = (password) => {
    setPasswordInput(password);
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            id="filled-basic"
            label="username"
            type="text"
            value={usernameInput}
            name="Username"
            onChange={({ target }) => handleUsernameInput(target.value)}
          />
        </div>
        <br />
        <div>
          <TextField
            id="filled-basic"
            label="password"
            type="password"
            value={passwordInput}
            name="Password"
            onChange={({ target }) => handlePwInput(target.value)}
          />
        </div>
        <br />
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
