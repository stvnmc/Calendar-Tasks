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
    <h1>hola</h1>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/Calendar-Tasks/register" element={<RegisterPage />} />
    //     <Route path="/Calendar-Tasks/login" element={<LoginPage />} />

    //     <Route element={<ProtectedRoute />}>
    //       <Route path="/Calendar-Tasks" element={<Home />} />
    //       <Route path="/Calendar-Tasks/month/:id1/:id2" element={<Month />} />
    //       <Route path="/Calendar-Tasks/m/:id1/d/:id2/y/:id3" element={<Day />} />
    //       <Route path="/Calendar-Tasks/create-routine" element={<CreateRoutine />} />
    //     </Route>
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
