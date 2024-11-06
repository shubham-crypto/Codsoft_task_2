import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Assuming you use Axios for API requests
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export const Employee = () => {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    companyName: '',
    image: '', // Assuming you have an image URL or file path
    address: '',
    position: '',
    experience: '',
  });
  const {user} = useContext(AuthContext)
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchJobs(); // Fetch jobs when the component mounts
    fetchProfile(); // Fetch profile when the component mounts
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/employee/jobs`,{
          params: {
            userId: user.userId,
          },
      }); // Endpoint to fetch jobs by employee
      setJobs(response.data);
      //console.log(jobs)
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/profile`); // Endpoint to fetch profile info
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };


  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/profile`, profile); // Endpoint to update profile info
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    }
  };

  const navigate = useNavigate();

  const handleViewDetails = (job) => {
    //console.log(job._id)
    navigate(`/job/${job._id}`, { state: { job } });
  };

  return (
    <div className="flex flex-col items-center md:flex-row  text-white  bg-[url('emp.avif')] bg-cover bg-center">
      {/* Left column for profile info */}
      <div className="w-1/4 p-4 text-black">
        <div className="flex flex-col items-center">
          <img
            src={profile.image || 'default.webp'} // Default image if none provided
            alt="Profile"
            className=" w-16 h-16 md:w-32 md:h-32 rounded-full mb-4"
          />
          <form className="flex flex-col space-y-4" onSubmit={handleProfileSubmit}>
            <input
              type='text'
              placeholder='Name'
              value={profile.name}
              className='p-2'
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              type='text'
              placeholder='Age'
              value={profile.age}
               className='p-2'
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
            />
            <input
              type='text'
              placeholder='Gender'
              value={profile.gender}
               className='p-2'
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            />
            <input
              type='text'
              placeholder='Contact Info'
              value={profile.contact}
               className='p-2'
              onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
            />
            <input
              type='text'
              placeholder='Company Name'
              value={profile.companyName}
               className='p-2'
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
            />
            <input
              type='text'
              placeholder='Address'
              value={profile.address}
               className='p-2'
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
            <input
              type='text'
              placeholder='Position'
              value={profile.position}
               className='p-2'
              onChange={(e) => setProfile({ ...profile, position: e.target.value })}
            />
            <input
              type='text'
              placeholder='Experience'
              value={profile.experience}
               className='p-2'
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
            />
            <button type='submit' className='flex items-center bg-green-400 rounded h-8 justify-center px-4 hover:bg-green-500 text-white '>Update Profile</button>
          </form>
        </div>
      </div>

      {/* Right column for job posting and job list */}
      <div className="w-3/4 p-4 flex flex-col space-y-4 items-center border-2">
        <h1 className='text-2xl'> Jobs Applied</h1>
        {/* Job posting form */}
        <div className='flex flex-wrap flex-shrink space-x-4 border-2 w-full h-full '>
            {/* Render jobs */}
            {jobs.map(job => (
              <div key={job.id} className="mt-4 border-2 rounded-2xl h-fit p-2 bg-orange-300">
                <h3>{job.title}</h3>
                <p>{job.description.substring(0, 15)}...</p> {/* Show a snippet of description */}
                <button onClick={() => handleViewDetails(job)}>See more</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
