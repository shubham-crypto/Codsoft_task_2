import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Import your AuthContext

export const Contact = () => {
  const { user } = useContext(AuthContext); // Assuming AuthContext provides user info
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/send-email`, {
        from: user.email, // User's email from AuthContext
        name:name,
        feedback,
      });
      alert('Feedback sent successfully!');
      setName('');
      setFeedback('');
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Error sending feedback');
    }
  };

  return (
    <div className='flex flex-col space-y-8 justify-center items-center'>
      <h1 className='text-2xl text-white '>Contact Us</h1>
      <form className='flex flex-col space-y-8 justify-center items-center w-full' onSubmit={handleSubmit}>
        <div className="flex flex-col items-center  max-w-md">
          <label htmlFor="name" className="mb-2 text-white">Your Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="flex flex-col items-center w-full max-w-md mt-4">
          <label htmlFor="feedback" className="mb-2 text-white">Feedback:</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full h-40 resize-none"
          />
        </div>
        <button type="submit" className="rounded bg-green-400 hover:bg-green-500 text-white px-4 py-2 mt-4 transition-colors duration-300">Send</button>
      </form>
    </div>
  );
};
