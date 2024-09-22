import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrowLeft from "../images/arrowLeft.png";


export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:5000/check-auth", {
                    method: "GET",
                    credentials: "include" 
                });
                const data = await response.json();
                if (data.authenticated) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking auth:", error);
            }
        };

        checkAuth();
    }, []);

    const logout = async () => {
        try {
          const response = await fetch('http://localhost:5000/logout', {
            method: 'POST',
            credentials: 'include', // Include session cookie
          });
      
          if (response.ok) {
            // Redirect to login page or home
            navigate('/login');
            window.location.reload();
          } else {
            console.error('Logout failed');
          }
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };
      
      
    

    return (
        <>
           <div 
                className={`fixed left-0 top-15 transition-width duration-300 ${isSidebarOpen ? "w-[10vw]" : "w-16"} overflow-hidden`} 
                style={{ height: "calc(100vh - 3.75rem)" }} 
                id="mySidebar"
            >
                <button onClick={toggleSidebar} className="p-2">
                    <img 
                        className={`w-auto h-11 sm:h-11 transform transition-transform ${isSidebarOpen ? "" : "rotate-180"}`} 
                        src={arrowLeft} 
                        alt="arrowLeft" 
                    />
                </button>

                {isSidebarOpen && (
                    <div className="flex flex-col justify-between h-[90%]"> 
                        <nav className="flex flex-col gap-4 p-4 h-[90%]">
                            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
                            <Link to="/browse" className="text-gray-700 hover:text-gray-900">Browse</Link>
                            <Link to="/favourite" className="text-gray-700 hover:text-gray-900">Favourite</Link>
                            <Link to="/playlist" className="text-gray-700 hover:text-gray-900">Playlist</Link>
                        </nav>    
                        <div className="pt-[10%] flex flex-col">
                            <div>
                                <Link to="/setting">Setting</Link>
                            </div>
                            <div>
                                {isLoggedIn ? (<button onClick={logout}>Log Out</button>) : (<Link to="/login">Log In</Link>)} 
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
}
