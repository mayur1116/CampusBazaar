import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          CampusBazaar
        </Link>

        {/* Hamburger button for mobile */}
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/create" onClick={closeMenu}>Sell Item</Link>
              </li>
              <li>
                <Link to="/my-listings" onClick={closeMenu}>My Listings</Link>
              </li>
              <li>
                <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
              </li>
              <li>
                <Link to="/profile" onClick={closeMenu}>Profile</Link>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMenu}>Login</Link>
              </li>
              <li>
                <Link to="/signup" onClick={closeMenu}>Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
