import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = () => {
    const {currentUser} = useSelector(state  => state.user);
    const [searchTerm,setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm',searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search); 
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    },[location.search])

  return (
   <header className='bg-violet-800 shadow-md'>
    <div className='flex justify-between items-center max-6xl mx-10 p-3'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-amber-100'>Real</span>
            <span className='text-red-200'>Estate</span>  
        </h1>
        <form className='bg-slate-100 p-3 rounded-lg flex items-center' onSubmit={handleSubmit}>
            <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' value ={searchTerm} onChange ={(e)=>{setSearchTerm(e.target.value)}} ></input>
            <button><FaSearch className='text-slate-600'></FaSearch></button>
            
        </form>
        <ul className='flex gap-4'>
            <Link to='/'>
                <li className='hover:underline text-white font-semibold hidden  sm:inline '>Home</li>
            </Link>
            <Link to='/about'>
                <ii className='hover:underline text-white font-semibold hidden sm:inline'>About</ii>
            </Link>
            <Link to='/profile'>
                {/* {}avatar */}
                {/* {console.log("lifniwoenfofowef",currentUser)} */}
                {currentUser.avatar ?(<img className='rounded-full h-7 w-7' src={currentUser.avatar} alt='profile'></img>):<li className='hover:underline text-slate-700 hidden sm:inline'>Sign In</li>}
               
            </Link>
        </ul>
    </div>
   </header>
  )
}

export default Header
