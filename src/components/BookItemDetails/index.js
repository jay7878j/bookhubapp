import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookItemDetails extends Component {
  state = {
    bookDetails: {},
    apiStatus: apiStatusConstraints.initial,
  }

  componentDidMount() {
    this.getBookItemDetails()
  }

  getBookItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstraints.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken);
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id);
    const apiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    // console.log(response);
    if (response.ok) {
      const data = await response.json()
      // console.log(data);
      const formatBookDetails = {
        aboutAuthor: data.book_details.about_author,
        aboutBook: data.book_details.about_book,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        readStatus: data.book_details.read_status,
        id: data.book_details.id,
        title: data.book_details.title,
        rating: data.book_details.rating,
      }
      console.log(formatBookDetails)

      this.setState({
        bookDetails: formatBookDetails,
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  // Render Loading View
  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  // On Failure View
  renderFailureView = () => {
    const failureImg =
      'https://res.cloudinary.com/amjay/image/upload/v1687973957/Group_7522_n3zo28.png'
    const failureAltText = 'failure view'

    const onTryAgain = () => {
      this.getBookItemDetails()
    }

    return (
      <div className="failure-view-container">
        <img
          className="failure-view-img"
          src={failureImg}
          alt={failureAltText}
        />
        <p className="failure-text">Something went wrong, Please try again.</p>
        <button className="failure-btn" type="button" onClick={onTryAgain}>
          Try Again
        </button>
      </div>
    )
  }

  //   On Successful Render
  renderSuccessView = () => {
    const {bookDetails} = this.state
    const {
      coverPic,
      rating,
      authorName,
      readStatus,
      title,
      aboutAuthor,
      aboutBook,
    } = bookDetails

    return (
      <div className="book-details-content-section">
        <div className="top-section">
          <img className="book-details-img" src={coverPic} alt={title} />
          <div className="book-details-info">
            <h1 className="book-heading book-details-heading">{title}</h1>
            <p className="book-author">{authorName}</p>
            <p className="book-details-rating rating">
              Avg Rating
              <BsFillStarFill className="rating-icon" color="red" />
              {rating}
            </p>
            <p className="read-status">
              Status: <span className="status">{readStatus}</span>
            </p>
          </div>
        </div>
        <hr />
        <div className="bottom-section">
          <div className="about">
            <h1 className="about-heading">About Author</h1>
            <p className="book-description">{aboutAuthor}</p>
          </div>
          <div className="about">
            <h1 className="about-heading">About Book</h1>
            <p className="book-description">{aboutBook}</p>
          </div>
        </div>
      </div>
    )
  }

  // Get Render Views
  getRenderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstraints.inProgress:
        return this.renderLoadingView()

      case apiStatusConstraints.success:
        return this.renderSuccessView()

      case apiStatusConstraints.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        <Header />
        <div className="book-details-main-section">{this.getRenderViews()}</div>
        <Footer />
      </div>
    )
  }
}

export default BookItemDetails
