import React from 'react';
import './particles.css'; // Custom animation styles
import { Link } from 'react-router-dom';

const NotFound = () => {
  const particles = Array.from({ length: 15 });

  return (
    <div className="relative h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <h1 className="group text-9xl font-bold text-gray-400 hover:tracking-widest transition-all duration-300 cursor-pointer hover-bright">
        4
        <span className="inline-block transition-transform duration-300 transform group-hover:-rotate-12">
          0
        </span>
        4
      </h1>
      <h2 className="text-3xl font-bold text-gray-400 mt-4 tracking-wide">Page Not Found</h2>
      <p className="text-gray-400 mt-4 text-xl">The page you are looking for does not exist.</p>
      <p className="text-gray-400 mt-2 text-xl">Don't worry we can show you the <Link className='underline hover-bright transition-all duration-300 ' to={"/"} >Light</Link></p>
      {particles.map((_, i) => (
        <div key={i} className="particle"></div>
      ))}
    </div>
  );
};

export default NotFound;

