import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./page/Home";
import Calendar from "./page/Calendar";
import NavigationBar from "./components/NavigationBar";
import Month from "./page/Month";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/month/:id" element={<Month />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
