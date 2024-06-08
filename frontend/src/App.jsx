import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './Pages/Auth/Register'
import Login from './Pages/Auth/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Root from './Pages/Root'
import PageNotFound from './Pages/PageNotFound'
import Reset from './Pages/Auth/Reset'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Root />} />
        <Route path='/auth'>
          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />
          <Route path='reset' element={<Reset />} />
        </Route>
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
