import React from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, Timer, Upload, BrainCircuit, Home } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Study Room</h2>
      <NavLink to="/" className="hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-2">
        <Home size={20} /> Dashboard
      </NavLink>
      <NavLink to="/pomodoro" className="hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-2">
        <Timer size={20} /> Pomodoro
      </NavLink>
      <NavLink to="/syllabus" className="hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-2">
        <BookOpen size={20} /> Syllabus
      </NavLink>
      <NavLink to="/upload" className="hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-2">
        <Upload size={20} /> Upload Notes
      </NavLink>
      <NavLink to="/assistant" className="hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-2">
        <BrainCircuit size={20} /> AI Assistant
      </NavLink>
          <NavLink to="/videocall" className="hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-2">
        <BrainCircuit size={20} />  VideoCall
      </NavLink>
    </div>
  );
};

export default Sidebar;
