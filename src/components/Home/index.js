import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstraints.initial,
    topRatedBooks: [],
  }

  componentDidMount() {
    this.getTopRatedBooksData()
  }

  //   Fetching Top Rated Books Data
  getTopRatedBooksData = async () => {
    this.setState({apiStatus: apiStatusConstraints.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      // console.log(data);

      // Converting snake_case formate to camelCase formate
      const foramtedData = data.books.map(eachBook => ({
        id: eachBook.id,
        title: eachBook.title,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
      }))
      // console.log(foramtedData);

      this.setState({
        apiStatus: apiStatusConstraints.success,
        topRatedBooks: foramtedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  //   Retuning Carousel Slider
  getCarouselSlider = () => {
    const {topRatedBooks} = this.state
    const settings = {
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      cssEase: 'linear',
      speed: 1000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <Slider {...settings}>
        {topRatedBooks.map(eachBook => {
          const {id, title, authorName, coverPic} = eachBook
          return (
            <Link to={`/books/${id}`} key={id}>
              <div className="top-rated-book-container">
                <img className="top-rated-img" src={coverPic} alt={title} />
                <h1 className="top-rating-heading">{title}</h1>
                <p className="top-rated-para">{authorName}</p>
              </div>
            </Link>
          )
        })}
      </Slider>
    )
  }

  // Returning Content Section
  getContentSection = () => (
    <div className="content-container">
      <h1 className="homeRoute-main-heading">Find Your Next Favorite Books?</h1>
      <p className="para">
        You are in the right place. Tell us what titles or genres you have
        enjoyed in the past, and we will give you surprisingly insightful
        recommendations.
      </p>
      <Link to="/shelf" className="sm-find-books-btn">
        <button type="button" className="find-books-btn">
          Find Books
        </button>
      </Link>
    </div>
  )

  //   On Loading View
  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  //   On Successful View
  renderSuccessView = () => (
    <div className="slider-container">{this.getCarouselSlider()}</div>
  )

  // On Failure View
  renderFailureView = () => {
    const failureImg =
      'https://res.cloudinary.com/amjay/image/upload/v1687973957/Group_7522_n3zo28.png'
    const failureAltText = 'failure view'

    const onTryAgain = () => {
      this.getTopRatedBooksData()
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

  //   Get Render Views
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

  //   Home Route Rendering
  render() {
    return (
      <div className="main-container">
        <Header />
        <div className="home-content-section">
          <div className="content-section">
            {this.getContentSection()}
            <div className="carousel-container">
              <div className="carousel-content-section">
                <h1 className="carousel-heading">Top Rated Books</h1>
                <Link to="/shelf">
                  <button
                    type="button"
                    className="md-find-books-btn find-books-btn"
                  >
                    Find Books
                  </button>
                </Link>
              </div>
              {this.getRenderViews()}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

export default Home
