// import {
//     useState,
//     useRef
//   } from "react"; 
import { Route, Routes} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer.js";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Browse } from "./pages/Browse.js";
import { Contact } from "./pages/Contact.js";
import { Apply } from "./pages/Apply.js";
import ProtectedRoute from './ProtectedRoute.js';
import {Employee} from "./pages/Employee.js";
import { Employer } from "./pages/Employer.js";
import { JobDescription } from "./pages/JobDescription.js";
import { JobPost } from "./pages/JobPost.js";

  function App() { 
   
    return ( 
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-500 to-blue-400 h-full"> 
        <Header />
        <div className="flex-grow">
          <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/signup' element={<Signup />}></Route>
              <Route path="/Browse" element={<ProtectedRoute Component={Browse} />} />
              <Route path="/contact" element={<ProtectedRoute Component={Contact} />} />
              <Route path="/ed" element={<ProtectedRoute Component={Employer} />} />
              <Route path="/apply/:jobId" element={<ProtectedRoute Component={Apply} />} />
              <Route path="/emp" element={<ProtectedRoute Component={Employee} />} />
              <Route path="/job/:id" element={<ProtectedRoute Component={JobDescription}/>} />
              <Route path="/jp" element={<ProtectedRoute Component={JobPost} />} />
          </Routes>
        </div>
        <Footer/>
      </div> 
    ); 
  } 
   
  export default App; 
  