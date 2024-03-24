import '../src/App.css'
import React from 'react'
import {BrowserRouter,Routes, Route} from 'react-router-dom';
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import About from "./Pages/About"
import Profile from "./Pages/Profile"
import Registration from "./Pages/Registration"
import PrivateRoute from './Components/PrivateRoute'
import CreateList from './Pages/CreateList';
import UpdateList from './Pages/UpdateList';
import Listing from './Pages/Listing';
import Search from './Pages/Search';




const App = () => {
  return (
   <BrowserRouter>
      <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/sign-in' element={<Login/>}/>
            <Route path='/register' element={<Registration/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/listing/:id' element={<Listing/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route element={<PrivateRoute/>}>
              <Route path='/profile' element={<Profile/>} />
              <Route path='/create-listing' element={<CreateList/>} />
              <Route path='/update-listing/:listId' element={<UpdateList/>} />
            </Route>
            
      </Routes>
   </BrowserRouter>
  )
}

export default App
