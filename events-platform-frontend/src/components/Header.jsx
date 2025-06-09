import "../App.css"
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ onLogout, isStaff }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="header" >
      <button onClick={handleLogout} >
        Logout
      </button>
      <Link to="/events" >
        Events
      </Link>
      {isStaff && <Link to="/create-event">Create Event</Link>}
    </header>
  );
}
