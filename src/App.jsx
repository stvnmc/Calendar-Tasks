import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./page/Home";
import Month from "./page/Month";
import Day from "./page/Day";
import LoginPage from "./page/LoginPage";
import ProtectedRoute from "./ProtectedRouter";
import RegisterPage from "./page/RegisterPage";
import CreateRoutine from "./page/CreateRoutine";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/month/:id1/:id2" element={<Month />} />
          <Route path="/m/:id1/d/:id2/y/:id3" element={<Day />} />
          <Route path="/create-routine" element={<CreateRoutine />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
