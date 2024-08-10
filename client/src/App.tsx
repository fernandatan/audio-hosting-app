import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/loginPage/loginPage";
import Register from "./components/registerPage/registerPage";
import Upload from "./components/uploadPage/uploadPage";
import Display from "./components/displayPage/displayPage";
import UserManagement from "./components/managementPage/managementPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/display" element={<Display />} />
        <Route path="/management" element={<UserManagement />} />
      </Routes>
    </div>
  );
}

export default App;