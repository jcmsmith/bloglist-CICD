import { ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material";
import { purple } from "@mui/material/colors";
import { Container } from "@mui/material";

import App from "./App";

export const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: "#f44336",
    },
  },
});

const ThemeContainer = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <App />
      </Container>
    </ThemeProvider>
  );
};

export default ThemeContainer;
