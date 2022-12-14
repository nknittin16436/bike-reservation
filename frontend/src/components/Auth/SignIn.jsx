import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LoginSchema } from "../../JoiSchema/Schema";
import { loginUser } from "../../Service/UserService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import Loader from "../Loader/Loader";
const theme = createTheme();

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    data.set(
      "email",
      email.slice(0, email.indexOf("@")).toLowerCase() +
        email.slice(email.indexOf("@"))
    );
    try {
      await LoginSchema.validateAsync({
        email: data.get("email"),
        password: data.get("password"),
      });
      setLoading(true);
      const res = await loginUser({
        email: data.get("email"),
        password: data.get("password"),
      });
      if (res.success) {
        localStorage.setItem("bike-user", res.accessToken);
        localStorage.setItem("bike-user-loggedIn", true);
        dispatch({ type: "isAuthenticated", payload: true });
        dispatch({ type: "loggedInUser", payload: res.user });
        if (res.user.role === "manager") {
          localStorage.setItem("bike-user-role", true);
          dispatch({ type: "isManager", payload: true });
        }
        if (res.user.role === "regular") {
          localStorage.setItem("bike-user-role", false);
          dispatch({ type: "isManager", payload: false });
        }
        alert.show(`Welcome ${res.user.name}`);
        navigate("/");
      } else {
        setLoading(false);
        alert.show("Some error occured Please try again");
      }
    } catch (error) {
      setLoading(false);
      alert.show(error.message);
    }
  };

  return (
    <div className="sign__container">
      {loading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
                <Grid container>
                  <Grid item>
                    <Link to="/register">Don't have an account? Sign Up</Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      )}
    </div>
  );
};

export default Login;
