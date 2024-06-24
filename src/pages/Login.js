import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signin(email, password);
      navigate('/'); // Navigate to home page or another page after successful login
    } catch (error) {
      console.error('Error logging in', error);
    }
  };
    return (
        <>
    <div className='w-80'>
        <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'>
           <div className='fixed w-full px-4 py-24 z-50'>
             <div className='max-w-[450px] h-[600px] mx-auto bg-cyan-300/75 text-white'>
                <div className='max w-[320px] mx-auto py-16'>
                    <h1 className='text-3xl font-bold'>Sign In</h1>
                    <form  className='w-full flex flex-col py-4'>
                        <input onChange={(e)=>setEmail(e.target.value)} className='p-3 my-2  text-black' type='email' placeholder='Email' autoComplete='email' />
                        <input onChange={(e)=>setPassword(e.target.value)} className='p-3 my-2  text-black' type='password' placeholder='Password' autoComplete='Current-password'/>
                        <button type="button" onClick={handleSubmit} className='bg-blue-500 py-3 my-6 rounded font-bold'>Sign In</button>
                        
                        <p className='py-8'>
                            <span >
                                New to Job Board?
                            </span>{' '}
                            <Link to='/Signup'>Sign Up</Link>
                        </p>
                        <p className='py-4'>
                            <span >
                                Return to
                            </span>{' '}
                            <Link to='/'>Home</Link>
                        </p>
                    </form>
                </div>
             </div>
           </div>
        </div>
    </div>
        </>
    )
}
