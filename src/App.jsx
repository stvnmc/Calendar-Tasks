import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./page/Home";
import NavigationBar from "./components/NavigationBar";
import Month from "./page/Month";
import Day from "./page/Day";
import LoginPage from "./page/LoginPage";
import ProtectedRoute from "./ProtectedRouter";
import RegisterPage from "./page/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/month/:id" element={<Month />} />
          <Route path="/m/:id1/d/:id2/y/:id3" element={<Day />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
