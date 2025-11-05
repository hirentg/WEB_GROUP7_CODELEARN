import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">CodeLearn</Link>
        <div className="nav-search">
          <input placeholder="Search for anything" />
        </div>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          {user ? (
            <div className="user-menu">
              <NavLink to="/">My Learning</NavLink>
              <button className="linklike" onClick={() => { logout(); navigate('/') }}>Logout</button>
              <div className="avatar" title={user.name || user.email}>
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-outline">Login</NavLink>
              <NavLink to="/register" className="btn btn-solid">Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}


