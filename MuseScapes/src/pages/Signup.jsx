import React, { useState } from "react";
import Navbar from "../components/Navbar";
import bcrypt from "bcryptjs";
import {useNavigate } from "react-router-dom"

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValidPassword = (password) => {
      const minLength = 6;
      const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
      const numberRegex = /[0-9]/;


      if (password.length < minLength) {
        return false;
      }


      if (!specialCharacterRegex.test(password)) {
        return false;
      }


      if (!numberRegex.test(password)) {
        return false;
      }
      return true;
    };
  
    if (!email || !userName || !password || !passwordConfirmation) {
      alert("Please fill out all entries");
      return;
    }

    if (password !== passwordConfirmation) {
      alert("Passwords do not match");
      return;
    }

    if (!isValidPassword(password)){
      alert("Password must be at least 6 characters long and contain at least one special character and one number")
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = {
      email,
      userName,
      hashPassword,
      salt,
    };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User registered:", data);
        alert("Account created successfully");

        //redirect to login.jsx
        navigate("/login");

      } else {
        alert("Failed to create account");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <>
      <Navbar />
      <div className="m-40 flex flex-col justify-center border-2 rounded-lg">
        <div className="m-2">
          <h1 className="font-bold">Create an account</h1>
          <p>Enter your email below to create your account</p>
          <div className="flex justify-center">
            <button className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">Google</button>
            <button className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Other</button>
          </div>
          <div className="relative flex items-center mt-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="absolute left-0 right-0 flex justify-center">
              <h1 className="px-4 bg-white text-gray-900">or continue with</h1>
            </div>
          </div>
          <form className="flex flex-col items-center mt-4" onSubmit={handleSubmit}>
            <label htmlFor="Email">Email</label>
            <input
              type="text"
              id="Email"
              name="Email"
              className="border-2 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="border-2 mb-2"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
            <label htmlFor="passwordconfirmation">Confirm your password</label>
            <input
              type="password"
              id="passwordconfirmation"
              name="passwordconfirmation"
              className="border-2 mb-4"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <input type="submit" value="Create account" className="border-2 mb-2" />
          </form>
        </div>
      </div>
    </>
  );
}
