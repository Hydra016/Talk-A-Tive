import { useState, useEffect, useContext } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/chats" element={<Chat />} />
    </Routes>
  );
}

export default App;
