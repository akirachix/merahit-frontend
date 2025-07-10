import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import "./style.css";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
    navigate("/dashboard");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPasswordOpen = () => {
    setOpenForgotPassword(true);
  };

  const handleForgotPasswordClose = () => {
    setOpenForgotPassword(false);
    setForgotEmail("");
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setOpenForgotPassword(false);
    setForgotEmail("");
  };

  return (
    <div className="login-bg">
      <div className="triangle triangle-left"></div>
      <div className="triangle triangle-right"></div>
      <div className="login-form-wrapper">
        <img
          src="Images/sokoconnectlogo-removebg-preview.png"
          alt="Logo"
          className="login-logo"
        />
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Admin Login</h2>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <span
              className={`password-toggle-icon ${showPassword ? "open" : "closed"}`}
              onClick={togglePasswordVisibility}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <FontAwesomeIcon icon={faEye} />
            </span>
          </div>
          <Typography
            variant="body2"
            onClick={handleForgotPasswordOpen}
            className="forgot-password"
          >
            Forgot Password?
          </Typography>
          <button type="submit">Log In</button>
        </form>
      </div>
      <Dialog open={openForgotPassword} onClose={handleForgotPasswordClose}>
        <DialogTitle>Recover Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter your admin email to receive your password.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordClose}>Cancel</Button>
          <Button onClick={handleForgotPasswordSubmit} color="primary">
            Send Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LoginPage;