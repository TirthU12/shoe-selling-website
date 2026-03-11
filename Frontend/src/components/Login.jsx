import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import '../css/Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    EmailOrPhone: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const apiLogin = 'http://localhost:3000/api/user/login'
  const apiGoogleLogin = 'http://localhost:3000/api/user/google-login'

  const validate = () => {
    const newErrors = {}
    if (!formData.EmailOrPhone) newErrors.EmailOrPhone = "Email or phone is required"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const res = await fetch(apiLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await res.json()

      if (!result.token) {
        alert(result.message || 'Invalid credentials')
        return
      }

      localStorage.setItem('jwtToken', result.token)
      navigate('/home')
      console.log('Token stored:', result.token)
    } catch (error) {
      console.error('Error logging in:', error.message)
      alert(`Failed to login: ${error.message}`)
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(apiGoogleLogin, {
        credential: credentialResponse.credential
      })
      localStorage.setItem('jwtToken', res.data.token)
      navigate('/home')
      console.log('Google login success:', res.data.user)
    } catch (error) {
       if (error.response) {
        if (error.response.status === 403) {
         
          alert(error.response.data.message);
        } else {
          alert(error.response.data.message || "Google login failed. Please try again.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleRegisterClick = () => {
    navigate('/Register')
  }

  return (
    <div className="login-container">
      <div className="login-main-card">
        
        
        <div className="login-left-section">
          <div className="login-left-overlay"></div>
          <div className="login-left-content">
            <svg className="login-sneaker-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M180 120C180 120 170 110 150 110C130 110 120 115 110 115C100 115 90 110 70 110C50 110 40 115 30 120L20 130L25 140L35 145C35 145 45 150 65 150C85 150 95 145 110 145C125 145 135 150 150 150C165 150 175 145 180 140V120Z" fill="white" stroke="black" strokeWidth="3" />
              <ellipse cx="110" cy="115" rx="70" ry="25" fill="#E5E7EB" stroke="black" strokeWidth="3" />
              <path d="M60 105L80 90L120 90L140 105" stroke="black" strokeWidth="3" fill="none" />
              <circle cx="90" cy="100" r="8" fill="black" />
              <circle cx="130" cy="100" r="8" fill="black" />
              <path d="M40 115C40 115 50 95 70 85C90 75 120 75 140 85C160 95 170 115 170 115" stroke="black" strokeWidth="3" fill="none" />
              <path d="M180 125L175 135L165 142C165 142 155 147 145 147" stroke="black" strokeWidth="2" fill="none" />
            </svg>
            <h1 className="login-brand-title">Sneakify</h1>
            <p className="login-brand-tagline">Step Into Style</p>
          </div>
        </div>

        {/* Right section */}
        <div className="login-right-section">
          <div className="login-form-container">
            <div className="login-header">
              <h2 className="login-welcome-title">Welcome Back!</h2>
              <p className="login-welcome-subtitle">Login to continue your sneaker journey</p>
            </div>

            {/* Form fields */}
            <div className="login-form-group">
              <label className="login-label">Email or Phone</label>
              <input
                type="text"
                name="EmailOrPhone"
                value={formData.EmailOrPhone}
                onChange={handleChange}
                placeholder="Enter your email or phone"
                className="login-input"
              />
              {errors.EmailOrPhone && <p className="login-error-text">{errors.EmailOrPhone}</p>}
            </div>

            <div className="login-form-group">
              <label className="login-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="login-input"
              />
              {errors.password && <p className="login-error-text">{errors.password}</p>}
            </div>

            <div className="login-button-group">
              <button onClick={handleSubmit} className="login-button">Login</button>
              <button onClick={handleRegisterClick} className="login-register-button">Create Account</button>
            </div>

            {/* Divider */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <hr />
              <p style={{ margin: '10px 0', color: '#666' }}>Or continue with</p>
            </div>

            {/* Google login */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log('Google Login Failed')}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
