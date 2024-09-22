import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from 'axios';
import { useEffect, useState } from "react";

export default function Discover() {
    const { type, genre } = useParams();
    const [music, setMusic] = useState([]);
    const [total, setTotal] = useState(0); 
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/type/${type}/genre/${genre}`)
            .then(response => {
                setMusic(response.data.data); 
                setTotal(response.data.total); 

                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching music data:', error);
            });

        axios.get("http://localhost:5000/api/get-user-details", { withCredentials: true })
            .then(response => {
                setUserId(response.data.userId);
            })
            .catch(error => {
                console.error("Error fetching user ID:", error);
            });
    }, [genre, type]);

    const addToFavorites = (track) => {
        if (!userId) {
            alert("You must be logged in to add favorites.");
            return;
        }

        axios.post("http://localhost:5000/api/favorites/add", {
            userId: userId,
            songName: track['Track Title'],
            artist: track['Artist'],
            album: track['Album'],
            songID: track['Song ID'],
            albumCover: track['Album Cover']
        }, { withCredentials: true })
            .then(response => {
                alert("Added to favorites!");
            })
            .catch(error => {
                console.error("Error adding to favorites:", error);
            });
    };

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="py-[3%] px-[10%]">
                <h1 className="font-bold">{genre} (Total: {total} {type === "albums" ? "Albums" : "Songs"})</h1>
                <div className="grid grid-cols-6 gap-7">
                    {Array.isArray(music) && music.length > 0 ? (
                        music.map((track, index) => (
                            <div key={index} className="music-item">
                                <img className = "object-cover h-64 w-64" src={track['Album Cover']} alt={track['Album']}/>
                                <h3>Song Name: {track['Track Title'] || track['Album']}</h3>
                                <p>Artist: {track['Artist']}</p>
                                <p>Album: {track['Album']}</p>
                                {type === "albums" ? (
                                    <Link to={`/albumdetail/${track['ID']}/${track['Album']}`}>
                                        View Album Songs
                                    </Link>
                                ) : (
                                    <button onClick={() => addToFavorites(track)}>Add to favorites</button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No music found.</p>
                    )}
                </div>
            </div>
        </>
    );
}
