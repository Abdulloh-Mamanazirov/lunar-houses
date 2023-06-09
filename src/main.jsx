import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import {ToastContainer} from "react-toastify"

import './index.css'
import "react-toastify/dist/ReactToastify.css";

import axios from "axios"
axios.defaults.baseURL = "https://lunar-house-backend.onrender.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <ToastContainer theme="colored"/>
  </BrowserRouter>,
)
