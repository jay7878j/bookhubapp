import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstraints = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookShelves extends Component {
  state = {
    searchInput: '',
    booksData: [],
    apiStatus: apiStatusConstraints.initial,
    readStatus: bookshelvesList[0].value,
    readLabel: bookshelvesList[0].label,
  }

  componentDidMount() {
    this.getBooksData()
  }

  //   Fetching Books Data
  getBooksData = async () => {
    this.setState({apiStatus: apiStatusConstraints.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {readStatus, searchInput} = this.state

    const apiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${readStatus}&search=${searchInput}`
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

      const formatData = data.books.map(eachBook => ({
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        readStatus: eachBook.read_status,
        id: eachBook.id,
        title: eachBook.title,
        rating: eachBook.rating,
      }))

      // console.log(formatData);
      this.setState({
        booksData: formatData,
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  //   Get Books
  getBooksList = () => {
    const {booksData} = this.state

    return (
      <ul className="books-list-container">
        {booksData.map(eachBook => {
          const {id, title, authorName, coverPic, rating, readStatus} = eachBook

          return (
            <Link to={`books/${id}`} className="book-link-item" key={id}>
              <li className="book-list-item">
                <img className="book-img" src={coverPic} alt={title} />
                <div className="book-info-container">
                  <h1 className="book-heading">{title}</h1>
                  <p className="book-author">{authorName}</p>
                  <p className="rating">
                    Avg Rating
                    <BsFillStarFill className="rating-icon" color="red" />
                    {rating}
                  </p>
                  <p className="read-status">
                    Status: <span className="status">{readStatus}</span>
                  </p>
                </div>
              </li>
            </Link>
          )
        })}
      </ul>
    )
  }

  //   Read Status Section
  getReadStatusSection = () => {
    const onReadStatusUpdate = (status, label) => {
      this.setState({readStatus: status, readLabel: label}, this.getBooksData)
    }
    const {readStatus} = this.state

    return (
      <div className="read-status-section">
        <h1 className="read-status-heading">Bookshelves</h1>
        <ul className="read-status-list-container">
          {bookshelvesList.map(eachShelf => {
            const {id, value, label} = eachShelf

            const activeShelf = readStatus === value

            const shelfClassName = activeShelf ? 'active-shelf-list-item' : ''
            const shelfBtnClassName = activeShelf ? 'active-shelf-btn' : ''

            const onShelfBtnClick = () => {
              onReadStatusUpdate(value, label)
            }

            return (
              <li className={`shelf-list-item ${shelfClassName}`} key={id}>
                <button
                  type="button"
                  className={`shelf-btn ${shelfBtnClassName}`}
                  onClick={onShelfBtnClick}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  //   Searchbar Container
  getSearchBarContainer = () => {
    const {readLabel, searchInput} = this.state

    const onUserSearchValue = event => {
      this.setState({searchInput: event.target.value})
    }

    const onEnterPress = event => {
      if (event.key === 'Enter') {
        this.getBooksData()
      }
    }

    const onSearchClick = () => {
      this.getBooksData()
    }

    return (
      <div className="search-container1">
        <h1 className="bookshelf-status-heading">{readLabel} Books</h1>
        <div className="search-container">
          <input
            type="search"
            className="search-box"
            placeholder="Search"
            onChange={onUserSearchValue}
            value={searchInput}
            onKeyDown={onEnterPress}
          />
          <button
            type="button"
            onClick={onSearchClick}
            testid="searchButton"
            className="search-btn"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
      </div>
    )
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
      this.getBooksData()
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

  //   No Search Results
  getNoSearchResults = () => {
    const {searchInput} = this.state
    const noResultsImg =
      'https://res.cloudinary.com/amjay/image/upload/v1687973957/Asset_1_1_vgok8k.png'
    const noResultsAltText = 'no books'

    return (
      <div className="no-search-results-container">
        <img
          className="no-results-img"
          src={noResultsImg}
          alt={noResultsAltText}
        />
        <h1 className="no-results-heading">
          Your search for
          {` ${searchInput} `}did not find any matches.
        </h1>
      </div>
    )
  }

  //   On Successful Render View
  renderSuccessView = () => {
    const {booksData} = this.state

    if (booksData.length === 0) {
      return this.getNoSearchResults()
    }

    return this.getBooksList()
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

  //   BookShelves Route Rendering
  render() {
    return (
      <div className="main-container">
        <Header />
        <div className="bookshelf-section">
          <div className="bookshelf-content-container">
            <div className="sm-search-container">
              {this.getSearchBarContainer()}
            </div>
            {this.getReadStatusSection()}
            <div className="right-section">
              <div className="md-search-container">
                {this.getSearchBarContainer()}
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

export default BookShelves
