import "./App.scss";
import Login from "./pages/Login/login";
import Chat from "./pages/Chat/chat";
import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./pages/defaultLayout";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
