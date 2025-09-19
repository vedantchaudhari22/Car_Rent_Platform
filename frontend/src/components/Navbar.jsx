import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast';

const Navbar = () => {

    const { showLogin,setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();

    const location = useLocation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const ownerDashboard = async () => {
        try {
            const { data } = await axios.get('/api/owner/dashboard');

            if (data.success) {
                //setIsOwner(true);
                 toast.success("Data Fetched Successully")
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 py-4 xl:px-32 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === '/' && "bg-light"}`}>
            <Link to='/'>
                <img src={assets.logo} className='h-8' alt="logo" />
            </Link>
            <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-boredrColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === '/' ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
                {
                    menuLinks.map((link, index) => (
                        <Link key={index} to={link.path}>
                            {link.name}
                        </Link>
                    ))
                }

                <div className='hidden lg:flex items-center text-sm gap-2 border boredr-borderColor px-3 rounded-full max-w-56'>
                    <input type="text" className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500' placeholder='Search Products' />
                    <img src={assets.search_icon} alt="search icon" />
                </div>

                <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
                    <button className='cursor-pointer'
                        onClick={() => {
                            if (isOwner) {
                                ownerDashboard();
                                navigate("/owner")
                            }
                            else{
                                if(!user){
                                    toast.error("Please Login First")
                                }
                                else{
                                    navigate('/cars');
                                    toast.success("List Of Available Cars")
                                }
                            }
                        }}>{isOwner ? 'DashBoard' : 'List Cars'}</button>
                    <button onClick={() => { user ? logout() : setShowLogin(true) }} className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull tranision-all text-white rounded-lg'>{user ? 'Logout' : 'Login'}</button>
                </div>
            </div>
            <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={() => setOpen(!open)}>
                <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
            </button>
        </div>
    )
}

export default Navbar
