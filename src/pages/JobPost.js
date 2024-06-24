import axios from 'axios';
import React, { useContext, useState } from 'react'
import { AuthContext } from '../AuthContext';


export const JobPost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [jobType, setJobType] = useState('');
    const [industry, setIndustry] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [skillsRequired, setSkillsRequired] = useState('');
    const {user}=useContext(AuthContext)
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { userId } = user;
        await axios.post('http://localhost:5000/api/employer/post-job', {
            title,
            description,
            location,
            salary,
            jobType,
            industry,
            experienceLevel,
            skillsRequired: skillsRequired.split(',').map(skill => skill.trim()),
            userId
        });
        alert('Job posted successfully');
        setTitle('');
        setDescription('');
        setLocation('');
        setSalary('');
        setJobType('');
        setIndustry('');
        setExperienceLevel('');
        setSkillsRequired('');
         // Refresh jobs after posting a new job
      } catch (error) {
        console.error('Error posting job:', error);
        alert('Error posting job: ' + error.message);
      }
    };
    return (
        <>
        <div className='flex flex-col items-center '>
            <h1 className='text-2xl text-white'>Describe your job </h1>
            <form className="flex flex-col space-y-6 text-black border-2 rounded-2xl h-fit p-4 mt-2 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 " onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='Job Title'
                className='p-2'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder='Job Description'
                className='p-2'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                    type='text'
                    placeholder='Location'
                    className='p-2'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type='number'
                    placeholder='Salary'
                    className='p-2'
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                />
                <select
                    className='p-2'
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    required
                >
                    <option value='' disabled>Select Job Type</option>
                    <option value='Full-time'>Full-time</option>
                    <option value='Part-time'>Part-time</option>
                    <option value='Contract'>Contract</option>
                    <option value='Internship'>Internship</option>
                    <option value='Temporary'>Temporary</option>
                </select>
                <input
                    type='text'
                    placeholder='Industry'
                    className='p-2'
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                />
                <select
                    className='p-2'
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    required
                >
                    <option value='' disabled>Select Experience Level</option>
                    <option value='Entry Level'>Entry Level</option>
                    <option value='Mid Level'>Mid Level</option>
                    <option value='Senior Level'>Senior Level</option>
                </select>
                <input
                    type='text'
                    placeholder='Skills Required (comma separated)'
                    className='p-2'
                    value={skillsRequired}
                    onChange={(e) => setSkillsRequired(e.target.value)}
                    required
                />
              <button type='submit' className='flex items-center bg-green-400 rounded h-8  text-white justify-center px-4 hover:bg-green-500 hover:border-5px'>Post Job</button>
            </form>
        </div>
        </>
    )
}
