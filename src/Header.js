import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function Header() {
  const { isLoggedIn, signout, user} = useContext(AuthContext);
  return (
    <header>
       <nav className=" text-white ">
        <ul className=" flex items-center justify-between  mx-auto  px-2 sm:px-6 lg:px-8" >
          <li className="text-2xl font-semibold">Job Board</li>
          <div className=" flex h-16 items-center  max-w-7xl space-x-4 sm:space-x-16">
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/Browse'>Browse Job</Link></li>
            <li><Link to='/Contact'>Contact</Link></li>
            {isLoggedIn && (
              <li>
                <Link to={user.role === 'employer' ? '/ed' : '/emp'}>
                  Dashboard
                </Link>
              </li>
            )}
          </div>
          <div className="flex  h-16 items-center  max-w-2xl space-x-8 ">
          {isLoggedIn ? (
            <div className="flex h-16 items-center max-w-2xl space-x-8">
              <li>Welcome</li>
              <button className="flex items-center bg-red-400 rounded h-12 justify-center px-4 hover:bg-red-500 hover:border-5px" onClick={signout}>Logout</button>
            </div>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <button className="flex items-center bg-green-400 rounded h-12 justify-center px-4 hover:bg-green-500 hover:border-5px"><Link to="/signup">Signup</Link></button>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
