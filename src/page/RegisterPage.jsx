import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { signup, errors, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const [showTextEmail, setShowTextEmail] = useState(false);
  const [showTextPassword, setShowTextPassword] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    await signup(e.target.email.value, e.target.password.value);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/Calendar-Tasks");
  }, [isAuthenticated]);

  const handleClick = (type) => {
    if (type === "email") setShowTextEmail(true);
    if (type === "password") setShowTextPassword(true);
  };

  const handleBlur = (event) => {
    const { id, value } = event.target;

    const inputState = {
      email: { state: showTextEmail, setState: setShowTextEmail },
      password: { state: showTextPassword, setState: setShowTextPassword },
    };

    if (inputState[id] && value === "") {
      inputState[id].setState(false);
    }
  };

  return (
    <div className="login-register">
    <div className="img-login">
        <img
          src={
            "https://assets-global.website-files.com/64c73d04a946980a4476537e/64cd4b8241e30d1ff98179ad_gamestation.png"
          }
        />
      </div>
      <div className="main-container">
        <div className="title">
          <h1>Bienvenidos a calendar nombre del calendario</h1>
        </div>
        <div className="error">
          <h2>{errors}</h2>
        </div>
        <form onSubmit={login} className="df-c">
          <div className={showTextEmail ? "cont df-c show" : "cont df-c"}>
            <label>Email</label>
            <input
              type="email"
              placeholder={showTextEmail ? "" : "Email"}
              onClick={() => handleClick("email")}
              onBlur={handleBlur}
              id="email"
              autoComplete="off"
            />
          </div>

          <div className={showTextPassword ? "cont df-c show" : "cont df-c"}>
            <label>Password</label>
            <input
              type="password"
              placeholder={showTextPassword ? "" : "Password"}
              onClick={() => handleClick("password")}
              onBlur={handleBlur}
              id="password"
              autoComplete="off"
            />
          </div>
          <button>Register</button>
        </form>

        <p>
          You have an account?
          <span>
            <Link to="/Login">Login</Link>
          </span>
        </p>
      </div>
      <div className="img-login">
        <img
          src={
            "https://assets-global.website-files.com/64c73d04a946980a4476537e/64cd4ad349ec3a4d94ff7554_chillin.png"
          }
        />
      </div>
    </div>
  );
};

export default RegisterPage;
