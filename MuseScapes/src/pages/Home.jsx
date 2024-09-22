import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import logo from "../images/logo.png"
import Sidebar from "../components/Sidebar";
import sami from "../images/potato.jpg"

export default function Home() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    return (
        <>
            <div className="h-screen overflow-hidden">
                <Navbar />
                <Sidebar/>

                <div className  ="flex justify-center">
                    <div className="text-center">
                        <div className="flex justify-center m-3">
                            <img className="w-auto h-14 sm:h-14 mt-5" src={logo} alt="Logo"/>
                        </div>

                        <h1 className="text-4xl text-center m-4">Discover and track your favourite music here</h1>
                        <p> Browse through millions of song and artist to discover your favourite song. </p>


                        <div className="m-5">
                        {isLoggedIn ? (                        
                        <Link to="/Browse">
                            <button className="bg-blue-500 text-white px-4 py-2 m-2 rounded">Browse</button>
                        </Link>):(                        
                        <Link to="/Signup">
                            <button className="bg-blue-500 text-white px-4 py-2 m-2 rounded">Sign up</button>
                        </Link>)}

                        <Link to="/About">
                            <button className="bg-gray-500 text-white px-4 py-2 m-2 rounded">Learn more</button>
                        </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row pl-[10%]">
                    <img class = " object-scale-down h-48 w-96" src = {sami}></img>
                    <img class = " object-scale-down h-48 w-96" src = {sami}></img>
                    <img class = " object-scale-down h-48 w-96" src = {sami}></img>
                    <img class = " object-scale-down h-48 w-96" src = {sami}></img>
                </div>
                
            </div>

        </>
    )
}
