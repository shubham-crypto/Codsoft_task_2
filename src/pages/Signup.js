
import React, { useContext, useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { AuthContext } from '../AuthContext'

export const Signup = () => {
     const [email, setEmail]= useState('')
    const [password , setPassword]=useState('')
    const [role, setRole] = useState('')
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await signup(email, password, role);
          navigate('/'); // Navigate to home page or another page after successful signup
        } catch (error) {
          console.error('Error signing up', error);
        }
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value); // Set the selected role
      };
    
    return (
        <>
    <div className='w-full'>
        <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'>
           <div className='fixed w-full px-4 py-24 z-50'>
             <div className='max-w-[450px] h-[600px] mx-auto bg-cyan-300/75 text-white'>
                <div className='max w-[320px] mx-auto py-16'>
                    <h1 className='text-3xl font-bold'>Sign Up</h1>
                    <form onSubmit={handleSubmit} className='w-full flex flex-col py-4'>
                        <input onChange={(e)=>setEmail(e.target.value)} className='p-3 my-2 text-black' type='email' placeholder='Email' autoComplete='email' />
                        <input onChange={(e)=>setPassword(e.target.value)} className='p-3 my-2 text-black' type='password' placeholder='Password' autoComplete='Current-password'/>
                        <div className='my-2'>
                            <label className='mr-4'>
                            <input
                                type='checkbox'
                                value='employer'
                                checked={role === 'employer'}
                                onChange={handleRoleChange}
                                className='mr-2'
                            />
                            Employer
                            </label>
                            <label>
                            <input
                                type='checkbox'
                                value='employee'
                                checked={role === 'employee'}
                                onChange={handleRoleChange}
                                className='mr-2'
                            />
                            Employee
                            </label>
                        </div>
                        <button className='bg-blue-500 py-3 my-6 rounded font-bold'>Sign Up</button>
                        <p className='py-8'>
                            <span >
                                Already have an account?
                            </span>{' '}
                            <Link to='/login'>Sign In</Link>
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
