import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

const smLoginImg =
  'https://res.cloudinary.com/amjay/image/upload/v1688275331/Ellipse_99_la5a6l.png'
const mdLoginImg =
  'https://res.cloudinary.com/amjay/image/upload/v1687973958/book.png'
const websiteLogo =
  'https://res.cloudinary.com/amjay/image/upload/v1687973956/Group_7731_xdkmqo.png'

const loginAltText = 'website login'
const websiteLogoAltText = 'login website logo'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    isUsernameError: false,
    isPasswordError: false,
    loginError: false,
    errorMsg: '',
  }

  //   On successful Login
  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 2})
    history.replace('/')
  }

  //   On Login Failure
  onLoginFail = errorMsg => {
    this.setState({loginError: true, errorMsg})
  }

  //   On Form Submit
  onFormSubmit = async event => {
    event.preventDefault()
    this.checkFormValidate()
    const {username, password} = this.state
    const userLoginDetails = {
      username,
      password,
    }
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userLoginDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFail(data.error_msg)
    }
  }

  //   Form Validation
  checkFormValidate = () => {
    const {username, password} = this.state

    if (username === '') {
      this.setState({isUsernameError: true})
    }

    if (password === '') {
      this.setState({isPasswordError: true})
    }
  }

  //   Username Container
  usernameContainer = () => {
    const {username, isUsernameError} = this.state

    const getUsernameValue = event => {
      this.setState({username: event.target.value})
    }

    // Username Blur Event check
    const onUsernameBlurCheck = event => {
      if (event.target.value === '') {
        this.setState({isUsernameError: true})
      } else {
        this.setState({isUsernameError: false})
      }
    }

    // Returning Username Container
    return (
      <div className="input-container">
        <label htmlFor="username" className="label">
          username
        </label>
        <input
          type="text"
          className="input-box"
          id="username"
          placeholder="Username"
          value={username}
          onChange={getUsernameValue}
          onBlur={onUsernameBlurCheck}
        />
        {isUsernameError ? <p className="error">*Required</p> : null}
      </div>
    )
  }

  //   Password Container
  passwordContainer = () => {
    const {password, isPasswordError} = this.state

    const getPasswordValue = event => {
      this.setState({password: event.target.value})
    }

    // Blur Event Check
    const onPasswordBlurCheck = event => {
      if (event.target.value === '') {
        this.setState({isPasswordError: true})
      } else {
        this.setState({isPasswordError: false})
      }
    }

    // Returning Password container
    return (
      <div className="input-container">
        <label htmlFor="password" className="label">
          password
        </label>
        <input
          type="password"
          className="input-box"
          id="password"
          placeholder="Password"
          value={password}
          onChange={getPasswordValue}
          onBlur={onPasswordBlurCheck}
        />
        {isPasswordError ? <p className="error">*Required</p> : null}
      </div>
    )
  }

  //   Application Rendering
  render() {
    const {loginError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page-container">
        <div className="login-img-container">
          <img className="sm-login-img" src={smLoginImg} alt={loginAltText} />
          <img className="md-login-img" src={mdLoginImg} alt={loginAltText} />
          <img
            className="sm-website-logo"
            src={websiteLogo}
            alt={websiteLogoAltText}
          />
        </div>
        <div className="form-container">
          <form onSubmit={this.onFormSubmit} className="form-card">
            <img
              className="md-website-logo"
              src={websiteLogo}
              alt={websiteLogoAltText}
            />
            {this.usernameContainer()}
            {this.passwordContainer()}
            <div className="login-btn-container">
              <button type="submit" className="login-btn">
                Login
              </button>
              {loginError && <p className="error">*{errorMsg}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
