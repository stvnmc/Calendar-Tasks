import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./page/Home";
import NavigationBar from "./components/NavigationBar";
import Month from "./page/Month";
import Day from "./page/Day";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/month/:id" element={<Month />} />
        <Route path="/m/:id1/d/:id2/y/:id3" element={<Day />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
