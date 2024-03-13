import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { dbAuth } from "../firebase/config";

export const userContext = createContext();

export const useUser = () => {
  const context = useContext(userContext);

  if (!context) {
    console.warn(
      "userContext not found. Make sure you are using UserProvider."
    );
  }

  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const localStore = (name, accessToken) => {
    const newInfo = [{ name: name, accessCalendar: accessToken }];
    localStorage.setItem("Calendar", JSON.stringify(newInfo));
  };

  async function signup(email, password) {
    try {
      const res = await createUserWithEmailAndPassword(dbAuth, email, password);

      const emailParts = res.user.email.split("@");
      const username = emailParts[0];
      setUser(username);

      localStore(username, res.user.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      let errorMessage = error.code;
      // Verifica si el error comienza con 'auth/'
      if (error.code.startsWith("auth/")) {
        // Elimina 'auth/' del código de error
        errorMessage = error.code.slice(5);
      }
      // Elimina todos los guiones (-) del mensaje de error
      errorMessage = errorMessage.replace(/-/g, " ");
      setErrors(errorMessage);
      throw error;
    }
  }

  async function signin(email, password) {
    try {
      const res = await signInWithEmailAndPassword(dbAuth, email, password);

      const emailParts = res.user.email.split("@");
      const username = emailParts[0];
      setUser(username);

      localStore(username, res.user.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      let errorMessage = error.code;
      // Verifica si el error comienza con 'auth/'
      if (error.code.startsWith("auth/")) {
        // Elimina 'auth/' del código de error
        errorMessage = error.code.slice(5);
      }
      // Elimina todos los guiones (-) del mensaje de error
      errorMessage = errorMessage.replace(/-/g, " ");
      setErrors(errorMessage);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(dbAuth);
      setUser(null);
      localStorage.removeItem("Calendar");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const storedInfo = localStorage.getItem("Calendar");
    if (storedInfo !== null) {
      const info = JSON.parse(storedInfo);
      const name = info[0].name;
      setIsAuthenticated(true);
      setUser(name);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <userContext.Provider
      value={{
        user,
        signup,
        signin,
        errors,
        isAuthenticated,
        logout,
        setIsAuthenticated,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
