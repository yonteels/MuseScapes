import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from 'axios';

export default function Favourite() {
    const [songs, setSongs] = useState([]);
    const [userDatas, setUserDatas] = useState({});
    const [error, setError] = useState(null);
    const [recommendedSongs, setRecommendedSongs] = useState([]);

    useEffect(() => {
        runCosineSimilarity();

        const fetchData = async () => {
            try {
                const [songsResponse, userResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/favourite', { credentials: 'include' }),
                    fetch('http://localhost:5000/api/get-user-details', { credentials: 'include' }),
                ]);

                if (!songsResponse.ok) throw new Error(`Songs HTTP error! status: ${songsResponse.status}`);
                if (!userResponse.ok) throw new Error(`User HTTP error! status: ${userResponse.status}`);

                const songsData = await songsResponse.json();
                const userData = await userResponse.json();
                setSongs(songsData);
                setUserDatas(userData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data");
            }
        };

        fetchData();
    }, []);

    const deleteSong = async (songID) => {
        try {
            const response = await axios.delete('http://localhost:5000/api/favourite/delete', {
                data: { userId: userDatas.userId, songID },
                withCredentials: true
            });

            if (response.status === 200) {
                setSongs(songs.filter(song => song['Song ID'] !== songID));
            }
        } catch (error) {
            console.error("Error deleting song:", error);
            setError("Failed to delete song");
        }
    };

    const runCosineSimilarity = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/favourite/runCosineSimilarity', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const recommendedSongData = await response.text();

            const songEntries = recommendedSongData.split('\n');
            const parsedSongs = songEntries.map(song => {
                if (!song.trim()) return null;

                const parts = song.split(', ');

                const songID = parts[0] ? parts[0].replace('Song ID: ', '').trim() : 'Unknown';
                const album = parts[1] ? parts[1].replace('Album: ', '').trim() : 'Unknown';
                const trackTitle = parts[2] ? parts[2].replace('Track Title: ', '').trim() : 'Unknown';
                const artist = parts[3] ? parts[3].replace('Artist: ', '').trim() : 'Unknown';

                return { songID, album, trackTitle, artist };
            }).filter(song => song !== null);

            setRecommendedSongs(parsedSongs);

        } catch (error) {
            console.log('Error running script', error);
        }
    };

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="py-[3%] px-[10%]">
                <div className="text-3xl font-bold">Liked Songs</div>
                <div>
                    <div className="grid grid-cols-7 gap-4 font-bold text-left">
                        <h2>#</h2>
                        <h2>Album Cover</h2>
                        <h2>Title</h2>
                        <h2>Album</h2>
                        <h2>Date Added</h2>
                        <h2>Duration</h2>
                        <h2>Action</h2>
                    </div>
                    {songs.length > 0 ? (
                        songs.map((song, index) => (
                            <div key={index} className="grid grid-cols-7 items-center justify-start gap-4 py-2 border-b border-gray-200">
                                <h2>{index + 1}</h2>
                                <img className="object-cover h-12 w-12" src={song['Album Cover']} alt="Album Cover"/>
                                <h2>{song['Song Name'] || 'No song name available'}</h2>
                                <h2>{song['Album'] || 'No album available'}</h2>
                                <h2>{new Date(song['Date Added']).toLocaleDateString() || 'No date available'}</h2>
                                <h2>{'No duration available'}</h2> {/* Add duration */}
                                <button className="text-red-500 hover:text-red-700 text-left" onClick={() => deleteSong(song['Song ID'])}>DELETE</button>
                            </div>
                        ))
                    ) : (
                        <p>No songs found.</p>
                    )}

                    <h1 className="text-3xl font-bold pt-[10%]">Recommendation</h1>
                    <h1>Based on your Liked songs</h1>
                    <button onClick={runCosineSimilarity}>Click to refresh recommended songs</button>
                    <div className="grid grid-cols-7 gap-4 font-bold text-left">
                        <h2>#</h2>
                        <h2>Album Cover</h2>
                        <h2>Title</h2>
                        <h2>Album</h2>
                        <h2></h2>
                        <h2>Duration</h2>
                        <h2>Artist</h2>
                    </div>
                    {/* Display recommended songs */}
                    {recommendedSongs.length > 0 ? (
                        recommendedSongs.map((song, index) => (
                            <div key={index} className="grid grid-cols-7 items-center justify-start gap-4 py-2 border-b border-gray-200">
                                <h1>{index + 1}</h1>
                                <img className="object-cover h-12 w-12" src={song.albumCover || 'default.jpg'} alt="Album Cover"/> {/* Add album cover */}
                                <h1>{song.trackTitle}</h1>
                                <h1>{song.album}</h1>
                                <h2>{/* Add duration if available */}</h2>
                                <h2>{song.artist}</h2>
                            </div>
                        ))
                    ) : (
                        <p>No recommendations yet. Click the button to refresh.</p>
                    )}
                </div>
            </div>
        </>
    );
}
