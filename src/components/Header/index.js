import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBook} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const websiteLogo =
  'https://res.cloudinary.com/amjay/image/upload/v1687973956/Group_7731_xdkmqo.png'
const websiteLogoAltText = 'login website logo'

class Header extends Component {
  onLogoutBtnClick = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  //   Mobile Navbar Container
  getSmNavLinkContainer = () => (
    <ul className="nav-links-container">
      <Link to="/" className="nav-link-item">
        <li className="nav-item">
          <AiFillHome className="nav-icon" />
        </li>
      </Link>
      <Link to="/shelf" className="nav-link-item">
        <li className="nav-item">
          <BsBook className="nav-icon" />
        </li>
      </Link>
      <li className="nav-item">
        <button
          type="button"
          className="logout-icon-btn"
          onClick={this.onLogoutBtnClick}
        >
          <FiLogOut className="nav-icon" />
        </button>
      </li>
    </ul>
  )

  //   Medium Devices Navbar Container
  getMdNavLinkContainer = () => (
    <ul className="nav-links-container">
      <Link to="/" className="nav-link-item">
        <li className="md-nav-item">Home</li>
      </Link>
      <Link to="/shelf" className="nav-link-item">
        <li className="md-nav-item">Bookshelves</li>
      </Link>
      <li className="nav-item">
        <button type="button" className="btn" onClick={this.onLogoutBtnClick}>
          Logout
        </button>
      </li>
    </ul>
  )

  //   Header Route Rendering
  render() {
    return (
      <nav className="nav-bar-container">
        <Link to="/">
          <img
            className="website-logo"
            src={websiteLogo}
            alt={websiteLogoAltText}
          />
        </Link>
        <div className="sm-nav-link-container">
          {this.getSmNavLinkContainer()}
        </div>
        <div className="md-nav-link-container">
          {this.getMdNavLinkContainer()}
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
