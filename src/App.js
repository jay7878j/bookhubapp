import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import BookShelves from './components/BookShelves'
import BookItemDetails from './components/BookItemDetails'

// import BookItemDetails from './components/BookItemDetails'
// import NotFound from './components/NotFound'

import './App.css'
import NotFound from './components/NotFound'

// use the below bookshelvesList for rendering read status of book items in Bookshelves Route

// const bookshelvesList = [
//   {
//     id: '22526c8e-680e-4419-a041-b05cc239ece4',
//     value: 'ALL',
//     label: 'All',
//   },
//   {
//     id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
//     value: 'READ',
//     label: 'Read',
//   },
//   {
//     id: '2ab42512-3d05-4fba-8191-5122175b154e',
//     value: 'CURRENTLY_READING',
//     label: 'Currently Reading',
//   },
//   {
//     id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
//     value: 'WANT_TO_READ',
//     label: 'Want to Read',
//   },
// ]

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/shelf" component={BookShelves} />
      <ProtectedRoute exact path="/books/:id" component={BookItemDetails} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
    </Switch>
  </BrowserRouter>
)

export default App
