import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BiSearchAlt2} from 'react-icons/bi'
import {AiFillStar} from 'react-icons/ai'
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
            <Link to={`books/${id}`} className="book-link-item">
              <li className="book-list-item">
                <img className="book-img" src={coverPic} alt={title} />
                <div className="book-info-container">
                  <h1 className="book-heading">{title}</h1>
                  <p className="book-author">{authorName}</p>
                  <p className="rating">
                    Avg Rating
                    <AiFillStar className="rating-icon" color="red" />
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

    return (
      <div className="read-status-section">
        <h1 className="read-status-heading">Bookshelves</h1>
        <ul className="read-status-list-container">
          {bookshelvesList.map(eachShelf => {
            const {id, value, label} = eachShelf

            const onShelfBtnClick = () => {
              onReadStatusUpdate(value, label)
            }

            return (
              <li className="shelf-list-item" key={id}>
                <button
                  type="button"
                  className="shelf-btn"
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
          <button type="button" onClick={onSearchClick} className="search-btn">
            <BiSearchAlt2 className="search-icon" />
          </button>
        </div>
      </div>
    )
  }

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
              {this.getBooksList()}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

export default BookShelves
