import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";

export default function About() {
    const { isAuthenticated, username, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>; 
    }

    return(
        <>
            <Navbar />
            <h1>Welcome to MuseScapes</h1>
            <h1>Here you can discover millions of different music</h1>
            <h1>Keep track of your favorite song</h1>
            <h1>Be introduced to personally curated music based on your favorite song</h1>
            <h1>And be introduced to curated music based on your playlist</h1>

        </>
    );
}
