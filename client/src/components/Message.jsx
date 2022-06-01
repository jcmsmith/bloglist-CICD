import { Alert } from "@mui/material";
import { useSelector } from "react-redux";

const Message = (props) => {
  const text = useSelector((state) => state.notification.message);

  const isError = useSelector((state) => state.notification.isError);

  if (!text) {
    return null;
  }

  let style = isError ? "error" : "success";

  return <Alert severity={style}>{text}</Alert>;
};

export default Message;
