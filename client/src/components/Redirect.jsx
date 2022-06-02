import { useNavigate, useMatch } from "react-router-dom";

import { ping, healthCheck, resetTestDB } from "../services/misc";

const Redirect = () => {
  const navigate = useNavigate();
  const pingMatch = useMatch("/api/ping");
  const healthMatch = useMatch("/api/ping/health");
  const testMatch = useMatch("/api/testing/reset");

  const errorMessage = <p>Something went wrong!</p>;

  const testingReset = async () => {
    const result = await resetTestDB();

    if (result) {
      navigate("/");
    } else {
      return errorMessage;
    }
  };

  const sendPing = async () => {
    const result = await ping();

    if (result) {
      navigate("/");
    } else {
      return errorMessage;
    }
  };

  const checkHealth = async () => {
    const result = await healthCheck();

    if (result) {
      navigate("/");
    } else {
      return errorMessage;
    }
  };

  if (pingMatch) {
    sendPing();
  }
  if (healthMatch) {
    checkHealth();
  }
  if (testMatch) {
    testingReset();
  }

  return null;
};

export default Redirect;
