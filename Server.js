require('dotenv').config();
const express = require("express");
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const authMiddleware = require('./authMiddleware');
const sendFeedbackEmail = require('./sendFeedbackEmail');
const sendEmailNotification= require('./sendEmailNotification');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(express.urlencoded({ limit: '1000mb' , extended: true }));

// app.use(express.json({ limit: '1000mb' }));
// app.use(express.static("public"));
const secret = process.env.JWT_SECRET;

app.use('/api/me', authMiddleware);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1/JobsDB");
  console.log("Connected");

  const UserSchema = new mongoose.Schema({
      email: {
          type: String,
          required: true,
          unique: true,
      },
      password: {
          type: String,
          required: true,
      },
      role: {
          type: String,
          enum: ['employee', 'employer'],
          default: 'employee',
      },
      resume: {
          type: String, // File path or reference to the resume file
      },
      form: {
          type: String, // File path or reference to the form file
      },
      profile: {
        name: String,
        age: String,
        gender: String,
        contact: String,
        companyName: String,
        address: String,
        position: String,
        department: String,
        skills: String,
        experience: String,
        education: String,
        linkedIn: String,
        profileSummary: String,
        profilePicture: String,
      },
      // Other fields as needed
  });
  const JobSchema = new mongoose.Schema({
    title: String,
    userId: String,
    description: String,
    applicants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['Applied', 'Confirmed', 'Rejected'], default: 'Applied' },
      appliedAt: { type: Date, default: Date.now }, // The date the application was submitted
      newApplicant: { // Include newApplicant details
        name: String,
        email: String,
        phone: String,
        address: String,
        coverLetter: String,
        resume: String, // Assuming you store file path here
      }
    }
  ],
    location: String , // Job location
    salary:  Number , // Job salary
    jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'] }, // Type of job
    industry:  String , // Industry related to the job
    experienceLevel: { type: String, enum: ['Entry Level', 'Mid Level', 'Senior Level'] }, // Experience level required
    skillsRequired: { type: [String] }, // Skills required for the job
    postedAt: { type: Date, default: Date.now }, // Date when the job was posted
    updatedAt: { type: Date, default: Date.now }, // Date when the job was last updated
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' } // Status of the job posting
  });
  const Job = mongoose.model('Job', JobSchema);

  const User = new mongoose.model("User", UserSchema);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'D:/codsoft/task2/uploads'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname)); // Generate a unique filename
    },
  });
  const upload = multer({ storage });

  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await Job.find(); // Fetch all jobs from the database
      res.json(jobs); // Send the jobs data as JSON response
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ message: 'Error fetching jobs' });
    }
  });
  

  app.post('/api/signup', async (req, res) => {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    try {
      await newUser.save();
      res.status(201).send('User registered successfully');
    } catch (error) {
      res.status(500).send('Error registering user: ' + error.message);
    }
  });

  app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid email or password');
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '1h' });// correct order
    res.status(200).send({ token, role: user.role , userId: user._id});
  });


  app.post('/api/employer/post-job', async (req, res) => {
    const { title, description ,userId, location, salary, jobType, industry, experienceLevel, skillsRequired} = req.body;
    const newJob = new Job({
      title,
      userId,
      description,
      location,
      salary,
      jobType,
      industry,
      experienceLevel,
      skillsRequired
    });
  
    try {
      await newJob.save();
      res.status(201).send('Job posted successfully');
    } catch (error) {
      res.status(500).send('Error posting job: ' + error.message);
    }
  });

  // /api/me endpoint to return user information based on JWT token
  app.get('/api/me', authMiddleware,async (req, res) => {
    try {
      const { userId } = req.user; // Extract user ID from JWT payload
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Server error');
    }
  });
  app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId).select('profile');
      if (!user) {
        return res.status(404).send('Profile not found');
      }
      res.status(200).json(user.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).send('Server error');
    }
  });

  app.post('/api/profile',authMiddleware,  async (req, res) => {
    const updates = req.body;

    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).send('User not found');
      }

      user.profile = { ...user.profile, ...updates };
      await user.save();
      res.status(200).json(user.profile);
    } catch (error) {
      res.status(500).send('Server error: ' + error.message);
    }
  });

  app.get('/api/employer/jobs', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const jobs = await Job.find({ userId });
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).send('Error fetching jobs: ' + error.message);
    }
  });

  app.get('/api/employee/jobs', async (req, res) => {
    try {
      const userId = req.query.userId; // Assuming you pass the userId as a query parameter
  
      const jobs = await Job.find({ status: 'Open' });

      // Filter jobs based on the user's status in each job's applicants array
      const filteredJobs = jobs.map(job => ({
        ...job.toObject(),
        applicants: job.applicants.filter(applicant => applicant.userId === userId),
      }));
     
  
      res.status(200).json(filteredJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Error fetching jobs' });
    }
  });

  app.post('/api/send-email', authMiddleware, (req, res) => {
    const {from ,name, feedback } = req.body;
    const userEmail = from; // Assuming req.user.email contains the logged-in user's email
    try {
       sendFeedbackEmail(userEmail, name,feedback);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      res.status(500).send('Error sending email: ' + error.message);
    }
  });
 // Apply
  app.post('/api/employee/apply-job', upload.single('resume'), async (req, res) => {
    if (!req.file) {
      // No file uploaded, handle the error
      return res.status(400).send('No file uploaded.');
    }
  
    // File uploaded successfully, log the filename
    console.log('Uploaded file:', req.file.filename);
    try {
      const { name, email, phone, address, coverLetter , jobId, userId } = req.body;
  
      // Create a new applicant object
      const newApplicant = {
        name,
        email,
        phone,
        address,
        coverLetter,
        resume: req.file.filename, // Uploaded resume file name
        status: 'Applied', // Initial status is 'Applied'
      };
      const existingApplicant = await Job.findOne({// Assuming req.user.userId contains the userId of the current user
        applicants: {
          $elemMatch: { userId: userId }
        }
      });
      
      if (existingApplicant) {
        return res.status(400).send('You have already applied for this job.');
      }
      
      // If the applicant is not found, add them to the applicants array with the userId
      const job = await Job.findByIdAndUpdate(
        jobId,
        {
          $push: {
            applicants: {
              userId: userId,
              status: 'Applied',
              appliedAt: new Date(),
              newApplicant,
            }
          }
        },
        { new: true }
      );
  
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
      console.error('Error submitting application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.patch('/api/jobs/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const { status } = req.body;
  
    try {
      const job = await Job.findById(jobId);
  
      if (!job) {
        return res.status(404).send('Job not found');
      }
  
      job.status = status;
      await job.save();
  
      res.status(200).json({ message: 'Job status updated successfully' });
    } catch (error) {
      console.error('Error updating job status:', error);
      res.status(500).json({ message: 'Error updating job status' });
    }
  });

  app.post('/api/jobs/:jobId/confirm', async (req, res) => {
    const { jobId } = req.params;
    const { id , user} = req.body;
  
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).send('Job not found');
      }
      const applicant = job.applicants.find(app => app._id.toString() === id);
      
      if (!applicant) {
        return res.status(404).send('Applicant not found');
      }

      // Step 3: Update the applicant's status to 'Confirmed'
      applicant.status = 'Confirmed';

      // Save the job with the updated applicant status
      await job.save();

      // Send email notification
      console.log(user)
      sendEmailNotification(applicant.newApplicant.email,user.email, 'Application Confirmed', 'Your application has been confirmed.');
  
      res.send('Applicant confirmed');
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  
  // Handle Reject
  app.post('/api/jobs/:jobId/reject', async (req, res) => {
    const { jobId } = req.params;
    const { id, user } = req.body;
  
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).send('Job not found');
      }
      
      const applicant = job.applicants.find(app => app._id.toString() === id);
      if (!applicant) {
        return res.status(404).send('Applicant not found');
      }
  
      applicant.status = 'Rejected';
      await job.save();

      // Send email notification
      sendEmailNotification(applicant.newApplicant.email, user.email, 'Application Rejected', 'Your application has been rejected.');
  
      res.send('Applicant rejected');
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

  const getResumeFilePath = (applicantId) => {
    // Implement your logic here to get the resume file path from your database or file system
    // For demo purposes, we assume the resumes are stored in a folder named 'resumes'
    const resumeDirectory =  'D:/codsoft/task2/uploads';
    const resumePath = path.join(resumeDirectory, `${applicantId}`);
    return resumePath;
  };
  
  app.get('/api/getResumePath/:applicantId', async (req, res) => {
    const { applicantId } = req.params;
    try{
      const job = await Job.findOne({ 'applicants._id': applicantId });

      if (!job) {
        return res.status(404).send('Job not found');
      }

      // Find the applicant within the job
      const applicant = job.applicants.id(applicantId);

      if (!applicant) {
        return res.status(404).send('Applicant not found');
      }

      // Get the resume file name from the applicant's data
      const resumeFileName = applicant.newApplicant.resume;
      const resumePath = getResumeFilePath(resumeFileName);
      console.log(resumePath)
    
      // Check if the file exists
      if (fs.existsSync(resumePath)) {
        res.sendFile(resumePath);
      } else {
        res.status(404).send('Resume not found');
      }
    }catch (error) {
      console.error('Error fetching resume:', error);
      res.status(500).send('Server error');
    }
  });

  app.get('/api/browse', async (req, res) => {

    try {
      const { query, jobType, experienceLevel } = req.query;
      let filter = {};
    
      // Apply search query filter if provided
      if (query) {
        filter.title = { $regex: query, $options: 'i' }; // Case-insensitive search
      }
    
      // Apply jobType filter if provided
      if (jobType) {
        filter.jobType = jobType;
      }
    
      // Apply experienceLevel filter if provided
      if (experienceLevel) {
        filter.experienceLevel = experienceLevel;
      }
      const jobs = await Job.find(filter);
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ message: 'Error fetching jobs' });
    }
  });
  

  app.listen(5000, function () {
    console.log("Server started on port 5000");
  });


}
