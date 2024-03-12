import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { signin, errors, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    await signin(e.target.email.value, e.target.password.value);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  return (
    <div>
      <h1>{errors}</h1>

      <form onSubmit={login}>
        <input type="email" placeholder="Email" id="email" />

        <input type="password" placeholder="Password" id="password" />

        <button>Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
