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
import Budged from './Pages/Budged'
import Expense from './Pages/Expense'
import Finance from './Pages/Finance'
import Spent from './Pages/Spent'
import Gain from './Pages/Gain'
import Borrow from './Pages/Borrow'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Root />} />
        <Route path='/budget-planner' element={<Budged />} />
        <Route path='/expense-tracker' element={<Expense />} />
        <Route path='/financial-tip' element={<Finance />} />
        <Route path='/borrow' element={<Borrow />} />
        <Route path='/gain' element={<Gain />} />
        <Route path='/spent' element={<Spent />} />
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
