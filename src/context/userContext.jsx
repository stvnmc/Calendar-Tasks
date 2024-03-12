import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { dbAuth } from "../firebase/config";

export const userContext = createContext();

export const useUser = () => {
  const context = useContext(userContext);

  // Si el contexto no está definido, puedes manejar este caso según tus necesidades
  // Por ejemplo, puedes lanzar un error, devolver un valor por defecto o imprimir un mensaje de advertencia
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function signup(email, password) {
    try {
      const res = await createUserWithEmailAndPassword(dbAuth, email, password);

      setUser(res.user);
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
      setUser(res.user);

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

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Aquí devolvemos el usuario, las funciones de registro y inicio de sesión
  return (
    <userContext.Provider
      value={{ user, signup, signin, errors, isAuthenticated }}
    >
      {children}
    </userContext.Provider>
  );
};
