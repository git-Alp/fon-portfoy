import './App.css'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Portfolios from './pages/Portfolios'
import PortfolioDetail from './pages/PortfolioDetail'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4000';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/portfolios' element={<Portfolios />} />
      <Route path='/portfolio/:id' element={<PortfolioDetail />} />
    </Routes>
  )
}

export default App
