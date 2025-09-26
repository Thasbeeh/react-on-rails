import { useState } from 'react'
import './App.css'
import axios from 'axios'
import AppRoutes from './routes/routes'
import { BrowserRouter } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/login`

function getApiData() {
  return axios.get(API_URL).then((response) => response.data)
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
