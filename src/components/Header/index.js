// import {Link} from 'react-router-dom'
import {GoGrabber} from 'react-icons/go'

import './index.css'

export default function Header() {
  return (
    <div className="header-container">
      <nav className="nav-bar">
        <h1 className="header-logo">
          COVID19<span className="header-span">INDIA</span>
        </h1>
        <button className="menu-button" type="button">
          <GoGrabber className="menu-icon" />
        </button>
      </nav>
    </div>
  )
}
