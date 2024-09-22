import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", 
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        navigate("/"); // Navigate to the home page
        window.location.reload(); // Force a page refresh after login
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="m-40 flex flex-col justify-center border-2 rounded-lg">
        <div className="m-2">
          <h1 className="font-bold">Log in</h1>
          <p>Enter your email and password below to sign in</p>

          <form onSubmit={handleLogin} className="flex flex-col items-center mt-4">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              className="border-2 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="border-2 mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" value="Log in" className="border-2 mb-2" />
          </form>

          {error && <p className="text-red-500">{error}</p>}

          <div className="relative flex items-center mt-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="absolute left-0 right-0 flex justify-center">
              <h1 className="px-4 bg-white text-gray-900">Don"t have an account?</h1>
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <button className="text-blue-600">
              <Link to="/Signup">Sign up for MuseScapes</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
