import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => {
  const notFoundImg =
    'https://res.cloudinary.com/amjay/image/upload/v1687973957/Group_7484_z6anwm.png'
  const notFountAltText = 'not found'

  return (
    <div className="not-found-container">
      <img className="not-found-img" src={notFoundImg} alt={notFountAltText} />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-para">
        we are sorry, the page you requested could not be found,Please go back
        to the homepage.
      </p>
      <Link to="/">
        <button type="button" className="go-home-btn">
          Go Back to Home
        </button>
      </Link>
    </div>
  )
}
export default NotFound
