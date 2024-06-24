import React, { useContext } from 'react'
import { Link,  useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext';


export const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClick = () => {
        if (user.role !== 'employer') {
            alert('Please log in as an employer to continue.');
            return;
        }
        navigate('/jp');
    };
    return (
        <>
        <div className="flex flex-col items-center justify-center  space-y-4 p-4 h-80   text-white ">
            <p className="text-2xl">Are you a Job Seeker ?</p>
            <h1 className="text-6xl">Find Your Dream Job</h1>
            <button className=" text-2xl flex items-center border-4 rounded-3xl h-12 justify-center px-4 hover:bg-white hover:text-black"><Link to='/emp'>Lets go</Link></button>
        
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 p-4 h-80  bg-gradient-to-r from-blue-300 ">
            <p className="text-2xl">Or an Employer ?</p>
            <h1 className="text-6xl">Start Hiring Now</h1>
            <button onClick={handleClick} className=" text-2xl bg-white flex items-center border-4 rounded-3xl h-12 justify-center px-4 hover:bg-blue-300 hover:text-white">Post</button>
        </div>
        </>
    )
}
