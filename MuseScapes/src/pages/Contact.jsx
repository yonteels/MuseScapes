import Navbar from "../components/Navbar"
import React, { useState, useEffect } from "react";


export default function Contact(){

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

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

    return(
        <>
            <Navbar/>
            <div className="status-message">
                {isLoggedIn ? (<p>Logged In</p>) : (<p>Not Logged In</p>)}
            </div>
        </>
    )
}