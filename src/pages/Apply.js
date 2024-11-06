import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useParams } from 'react-router-dom';

export const Apply = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    resume: null, // This will hold the file object for resume upload
    coverLetter: '',
  });

  const {user , setUser}=useContext(AuthContext)
  const [applicants, setApplicants] = useState([]);
  const { jobId } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const  handleFileChange = (e) => {
    // console.log(e.target.files[0].name)
    setFormData((prevData) => ({
      ...prevData,
      resume: e.target.files[0], // Store the selected file object
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
  
  // Create a FormData object to handle file uploads
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('resume', formData.resume);
    data.append('coverLetter', formData.coverLetter);
    data.append('jobId', jobId); // Add jobId to the form data
    data.append('userId', user.userId);
    try {
        // Send the form data to your backend endpoint
        const sendData=Object.fromEntries(data.entries());
        await axios.post(`${apiUrl}/api/employee/apply-job`, sendData,{
            headers: {
                'Content-Type': 'multipart/form-data', // Important for file uploads
                
              },
        });
        // Update the user's resume field locally
        setUser(prevUser => ({
        ...prevUser,
        resume: formData.resumeFile,
        }));

        // Update the applicants array with the user's ID and status
        const updatedApplicants = [...applicants, { userId: user.userId, status: 'Applied' }];
        setApplicants(updatedApplicants);

        alert('Application submitted successfully');
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            resume: null,
            coverLetter: '',
          });
    } catch (error) {
       if(error.message==='Request failed with status code 400'){
        alert('You have already applied for this job.')
       }
       else{
        console.error('Error submitting application:', error);
        alert('Error submitting application: ' + error.message);
       }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 p-4 rounded-2xl bg-[url('appl.avif')] bg-cover ">
        <label htmlFor="name" className="text-lg">
            Name:
        </label>
        <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2"
        />

        <label htmlFor="email" className="text-lg">
            Email:
        </label>
        <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2"
        />

        <label htmlFor="phone" className="text-lg">
            Phone:
        </label>
        <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
        />

        <label htmlFor="address" className="text-lg">
            Address:
        </label>
        <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
        />

        <label htmlFor="resume" className="text-lg">
            Upload Resume:
        </label>
        <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
            className="border border-gray-300 rounded-lg p-2"
        />

        <label htmlFor="coverLetter" className="text-lg">
            Cover Letter:
        </label>
        <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={5}
            className="border border-gray-300 rounded-lg p-2"
        />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 border-2">
            Submit
        </button>
    </form>

    </>
  );
};
