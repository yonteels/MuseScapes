import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState} from "react";
import { useParams } from 'react-router-dom';

export default function AlbumDetail(){
    const [songs, setSongs] = useState([]);
    const { albumid, albumName } = useParams();  
    const [albumCover, setAlbumcover] = useState(); 
    const [artist, setArtist] = useState();
    const [userDatas, setUserDatas] = useState({});
    
    useEffect(() => {
        const fetchAlbumSongs = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/album_details/albumid/${albumid}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch songs');
                }
                const data = await response.json();
                setSongs(data); 
                console.log(data);
                if (data.length >0){
                    setAlbumcover(data[0]["Album Cover"]);
                    setArtist(data[0]["Artist"]);
                }
            } catch (error) {
                console.error('Error fetching album songs:', error);
            }
        };
    
        if (albumid) {
            fetchAlbumSongs();
        }
    }, [albumid]);

    const addToFavorites = (track) => {
        if (!userId) {
            alert("You must be logged in to add favorites.");
            return;
        }

        axios.post("http://localhost:5000/api/favorites/add", {
            userId: userId,
            songName: songs['Track Title'],
            artist: songs['Artist'],
            album: songs['Album'],
            songID: songs['Song ID'],
            albumCover: songs['Album Cover']
        }, { withCredentials: true })
            .then(response => {
                alert("Added to favorites!");
            })
            .catch(error => {
                console.error("Error adding to favorites:", error);
            });
    };

    
    

    return(
        <>
            <Navbar/>
            <Sidebar/>
            <div className="py-[3%] px-[10%]">
            <div className="flex flex-row">
                <img className="object-cover h-48 w-48" src = {albumCover}/>
                <div className="">
                    <h1 className="text-4xl font-bold">{albumName}</h1>
                    <h1 className=" text-2xl font-semibold">{artist}</h1>
                </div>

                <h1>Total song: {songs.length}</h1>
            </div>

            <div className="grid grid-cols-4 gap-4 font-bold text-left text-xl ">
                <h2>#</h2>
                <h2>Title</h2>
                <h2>Duration</h2>
                <h2>Action</h2>
                
            </div>
            {songs.length > 0 ? (
                songs.map((songs, index) => (
                    <div key={index} className="grid grid-cols-4 text-lg font-medium items-center justify-start gap-4 py-2 border-b border-gray-200">
                        <p>{index+1}</p>
                        <div className="flex flex-col">
                            <p>{songs['Track Title']} </p>
                            <p className="font-normal text-base">{songs["Artist"]}</p>
                        </div>
                        <h2>{'No duration available'}</h2>
                        <button className="text-green-500 hover:text-red-green text-left" onClick={() => addToFavorites(track)} >Add Song</button>
                    </div>
                ))
            ) : (
                <p>No songs found for this album.</p>
            )}

            </div>
        </>
    );
}