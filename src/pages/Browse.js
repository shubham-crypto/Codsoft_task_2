import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('');
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const fetchJobs = async (query, jobType, experienceLevel) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/browse`, {
        params: { query, jobType, experienceLevel },
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchJobs(searchQuery, jobTypeFilter, experienceLevelFilter);
  };

  const handleViewDetails = (job) => {
    navigate(`/job/${job._id}`, { state: { job } });
  };

  useEffect(() => {
    // Fetch all jobs when the component mounts
    fetchJobs('', '', '');
  }, []);

  return (
    <>
      <div className="flex justify-center my-4">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title..."
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="px-4 py-2 ml-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            {/* Add more job types as needed */}
          </select>
          <select
            value={experienceLevelFilter}
            onChange={(e) => setExperienceLevelFilter(e.target.value)}
            className="px-4 py-2 ml-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Experience Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            {/* Add more experience levels as needed */}
          </select>
          <button type="submit" className="px-4 py-2 ml-2 bg-green-500 text-white rounded-lg border-2">
            Search
          </button>
        </form>
      </div>

      <div className='flex flex-wrap space-x-4 items-center justify-center'>
        {jobs.map((job) => (
          <div key={job._id} className="border border-gray-300 rounded-lg p-4 mb-4 w-fit text-white">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.location}</p>
            <button onClick={() => handleViewDetails(job)}>See more</button>
          </div>
        ))}
      </div>
    </>
  );
};
