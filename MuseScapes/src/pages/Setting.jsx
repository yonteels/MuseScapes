import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

export default function Setting(){
    return(
        <>
            <Sidebar/>
            <Navbar/>
            <div className="py-[3%] px-[10%]">
                <div className="text-3xl font-bold">Setting</div>
                <div className="text-2xl font-semibold">Account</div>
                <h1>Edit profile</h1>
                <h1>Edit UserName</h1>
                <h1>Change Password</h1>
                <h1>Check Account Stat</h1>
            </div>
        </>
    )
}