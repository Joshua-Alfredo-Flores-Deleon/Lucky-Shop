// Register.jsx — registro de clientes con verificación por código
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/sideBar'
import '../productos.css'

const BASE_URL = 'http://localhost:4000/api'

const Register = () => {

  return (
    <div>
      <Sidebar />
    </div>
  )
}

export default Register
