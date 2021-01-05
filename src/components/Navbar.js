import React from 'react'
import '../styles/Navbar.css'
import logo from '../logo.png'

export default function Navbar(props) {
  return (
    <div className="navbar">
      <div className="container">
        <p className="navbar-brand">
          <span>
            <img src={logo} alt="Logo" className="logo" />
          </span>
          Bitcoin Price Tracker
        </p>
      </div>
    </div>
  )
}