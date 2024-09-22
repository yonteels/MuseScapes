// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact"
import About from "./pages/About";
import Browse from "./pages/Browse";
import Discovery from "./pages/Discovery";
import Favourite from "./pages/Favourite";
import Playlist from "./pages/Playlist";
import Setting from "./pages/Setting";
import AlbumDetail from "./pages/AlbumDetail";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";



export default function App() {
  
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path = "/browse" element = {<Browse />} />
        <Route path="/setting" element = {<Setting/>}/>
        <Route path="/albumdetail/:albumid/:albumName" element= {<AlbumDetail/>}/>
        <Route path = "/discovery/:type/:genre" element = {<Discovery/>}/>
        <Route path = "/favourite" element = {<ProtectedRoute> <Favourite/></ProtectedRoute>}/>
        <Route path="/playlist" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
        
      </Routes>
    </AuthProvider>
  );
}
