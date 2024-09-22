import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
export default function Browse (){

    return(
        <>
            <div className="h-screen overflow-y-hidden">
            <Navbar/>
            <Sidebar/>
                    
                <div className="py-[3%] px-[10%]">
                {/* catalogue section */}
                <h1 className="font-bold text-3xl">Browse All Album</h1>
                    {/* album */}
                    <div className=" py-3 grid grid-cols-4 gap-4">
                    <div className  ="text-left font-semibold"><Link to ="/Discovery/albums/All_Album">All Album</Link></div> 
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Pop">Pop</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Rock">Rock</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Hip-Hop">Hip-Hop</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Jazz">Jazz</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Classical">Classical</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Electronic">Electronic</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Blues">Blues</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Brass & Military">Brass & Military</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Children's">Children's</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Folk, World, & Country">Folk, World, & Country</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Funk">Funk / Soul</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Latin">Latin</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Non-Music">Non-Music</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Reggae">Reggae</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/albums/Stage & Screen">Stage & Screen</Link></div>
                    </div>
                    {/* music */}
                    <h1 className="pt-[3%] font-bold text-3xl">Browse All Music</h1>
                    <div className=" py-3 grid grid-cols-4 gap-4">
                        <div className  ="text-left font-semibold"><Link to ="/Discovery/tracks/All_Music">All Music</Link></div> 
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Pop">Pop</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Rock">Rock</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Hip-Hop">Hip-Hop</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Jazz">Jazz</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Classical">Classical</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Electronic">Electronic</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Blues">Blues</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Brass & Military">Brass & Military</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Children's">Children's</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Folk, World, & Country">Folk, World, & Country</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Funk">Funk / Soul</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Latin">Latin</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Non-Music">Non-Music</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Reggae">Reggae</Link></div>
                        <div className = "text-left font-semibold"><Link to ="/Discovery/tracks/Stage & Screen">Stage & Screen</Link></div>
                    </div>
                </div>
            </div>
        </>
    );
}
