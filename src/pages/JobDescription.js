import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import clsx from 'clsx';
const apiUrl = process.env.REACT_APP_API_URL;
const handleDownload = async (resumeFileName) => {
  try {
    const response = await axios.get(`${apiUrl}/api/getResumePath/${resumeFileName}`, {
      responseType: 'blob' // Important
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', resumeFileName); //or any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading resume:', error);
  }
};

const ApplicantItem = ({ applicant, onReject, onConfirm }) => (
  <div className="flex items-center justify-between p-4 border rounded-md mb-2">
    <div>
        <p>Name: {applicant.newApplicant.name}</p>
        <p>Email: {applicant.newApplicant.email}</p>
        <p>Phone: {applicant.newApplicant.phone}</p>
        <p>Address: {applicant.newApplicant.address}</p>
        <p>Cover Letter: {applicant.newApplicant.coverLetter}</p>
        <p>Resume: <button onClick={() => handleDownload(applicant._id)}>{applicant.newApplicant.resume}</button></p>
        <p>Status: {applicant.status}</p>
        <p>Applied At: {new Date(applicant.appliedAt).toLocaleDateString()}</p>
    </div>
    <div className="space-x-2">
      {applicant.status === 'Applied' && (
        <>
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => onReject(applicant._id)}>
            Reject
          </button>
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => onConfirm(applicant._id)}>
            Confirm
          </button>
        </>
      )}
      {applicant.status === 'Confirmed' && (
        <p className="bg-green-500 text-white px-3 py-1 rounded" > {applicant.status}</p>
      )}
      {applicant.status === 'Rejected' && (
        <p className="bg-red-500 text-white px-3 py-1 rounded" > {applicant.status}</p>
      )}
    </div>
  </div>
);

export const JobDescription = () => {
  const location = useLocation();
  const { job } = location.state || {}; // Use an empty object as a fallback
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState(job.status);
  const [applicantstatus, setapplicantStatus] = useState('');
  const [hasApplied, setHasApplied] = useState(false); // Assuming you have a state to track application status
  const [applicants, setApplicants]=useState(job.applicants)
  // console.log(applicants[0].userId)
  // Check if the user has applied for this job
  const checkApplicationStatus = () => {
    // Logic to check if the user has applied and set hasApplied accordingly
    // For example, you might fetch data from the backend or use context/state management
    // For demo purposes, I'm setting it to true here
    const userApplied = job.applicants.find(applicant => applicant.userId === user.userId);
    if(userApplied){
      setapplicantStatus(userApplied.status)
      setHasApplied(true);
    }
  };

  // Call checkApplicationStatus when the component mounts
  useEffect(() => {
    checkApplicationStatus();
  }, []);

  const isEmployer = user && user.role === 'employer';

  const handleConfirm = async (id) => {
  try {
    const response = await axios.post(`${apiUrl}/api/jobs/${job._id}/confirm`, { id ,  user});
    if (response.status === 200) {
      console.log('Applicant confirmed');
      // Optionally, update the state or refetch the job details
      const updatedApplicants = applicants.map(applicant => {
        if (applicant._id === id) {
          return { ...applicant, status: 'Confirmed' };
        }
        return applicant;
      });
      setApplicants(updatedApplicants);
    }
  } catch (error) {
    console.error('Error confirming applicant:', error);
  }
};

const handleReject = async (id) => {
  try {
    const response = await axios.post(`${apiUrl}/api/jobs/${job._id}/reject`, { id , user});
    if (response.status === 200) {
      console.log('Applicant rejected');
      // Optionally, update the state or refetch the job details
      const updatedApplicants = applicants.map(applicant => {
        if (applicant._id === id) {
          return { ...applicant, status: 'Rejected' };
        }
        return applicant;
      });
      setApplicants(updatedApplicants);
    }
  } catch (error) {
    console.error('Error rejecting applicant:', error);
  }
};
  if (!job) {
    return <p>No job details available.</p>;
  }

  const handleStatusChange = async () => {
    try {
      const response = await axios.patch(`${apiUrl}/api/jobs/${job._id}`, { status: status === 'Open' ? 'Closed' : 'Open' });
      setStatus(response.data.status);
    } catch (error) {
      console.error('Error changing job status:', error);
      alert('Error changing job status: ' + error.message);
    }
  };

  let statusColor = 'text-black';
  switch (applicantstatus) {
    case 'Applied':
      statusColor = 'text-blue-500';
      break;
    case 'Confirmed':
      statusColor = 'text-green-300';
      break;
    case 'Rejected':
      statusColor = 'text-red-300';
      break;
    default:
      statusColor = 'text-black'; // Default color if status is not one of the specified ones
  }

  return (
    <div className="flex flex-col items-center bg-[url('job-d.webp')] bg-cover bg-center p-8 rounded-lg shadow-lg border-2 border-gray-300 ">
      <h1 className="text-3xl font-bold mb-4 ">{job.title}</h1>
      <p className="text-lg mb-2 text-gray-800"><strong>Description:</strong> {job.description}</p>
      <p className="text-lg mb-2 text-gray-800"><strong>Location:</strong> {job.location}</p>
      <p className="text-lg mb-2 text-gray-800"><strong>Salary:</strong> {job.salary}</p>
      <p className="text-lg mb-2 text-gray-800"><strong>Job Type:</strong> {job.jobType}</p>
      <p className="text-lg mb-2 text-gray-800"><strong>Industry:</strong> {job.industry}</p>
      <p className="text-lg mb-2 text-gray-800"><strong>Experience Level:</strong> {job.experienceLevel}</p>
      <p className="text-lg mb-2 text-gray-800"><strong>Skills Required:</strong> {job.skillsRequired.join(', ')}</p>
      <p className="text-lg mb-2 text-gray-800"><strong>Posted At:</strong> {new Date(job.postedAt).toLocaleDateString()}</p>
      <p className="text-lg mb-2 text-gray-800"><strong>Updated At:</strong> {new Date(job.updatedAt).toLocaleDateString()}</p>
      {isEmployer && (
          <>
            <h2 className="text-2xl font-semibold mb-2">Applicants</h2>
            {applicants && applicants.length > 0 ? (
              applicants.map(applicant => (
                <ApplicantItem
                  key={applicant.userId}
                  applicant={applicant}
                  onReject={handleReject}
                  onConfirm={handleConfirm}
                />
              ))
            ) : (
              <p>No applicants for this job yet.</p>
            )}
            <p className="text-lg mb-2 text-gray-800"><strong>Status:</strong> {status}</p>
            <button 
              className={`mt-4 px-4 py-2 rounded ${status === 'Open' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              onClick={handleStatusChange}
            >
              {status === 'Open' ? 'Close Job' : 'Open Job'}
            </button>
          </>
        )}
      {!isEmployer && (
        <>
        {hasApplied ? (
          <p className={clsx('text-lg mb-2', statusColor)}>Application Status: {applicantstatus}</p>
          ) : (
            <>
              <p className="text-lg mb-2 text-gray-800"><strong>Status:</strong> {status}</p>
              <Link to={`/apply/${job._id}`} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 inline-block">
                Apply
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
};
