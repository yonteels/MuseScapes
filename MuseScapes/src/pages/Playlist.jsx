import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

export default function Playlist(){
    const [userDatas, setUserDatas]= useState({})
    useEffect (()=>{
        const fetchData = async () => {
            try{
                const [userResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/get-user-details', { credentials: 'include' }),
                ]);
                const userData = await userResponse.json();
                setUserDatas(userData);
            }
            catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data");
            }
        };
    fetchData(); 
    })

    // need to make api call to server and create a table 
    return(
        <>
            <Navbar/>
            <Sidebar/>
            <div className="py-[3%] px-[10%]">
                <h1>hello {userDatas.username}</h1>
            </div>

            
        </>
    )
}