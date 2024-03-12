import React, { useEffect } from "react";
import { useUser } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { signup, errors, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    await signup(e.target.email.value, e.target.password.value);
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

        <button>Register</button>
      </form>
      <p>
        You have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
