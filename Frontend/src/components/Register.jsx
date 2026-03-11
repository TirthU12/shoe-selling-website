import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/Register.css'  // Import external CSS file

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        user_name: '',
        password: '',
        email: '',
        number: '',
        gender: ''
    })
    const [errors, setErrors] = useState({})
    const apiRegister = 'http://localhost:3000/api/user/register'

    const validate = () => {
        const newErrors = {}
        
        if (!formData.user_name) {
            newErrors.user_name = "Username is required"
        } else if (formData.user_name.length < 1) {
            newErrors.user_name = "Minimum 1 character required"
        } else if (formData.user_name.length > 16) {
            newErrors.user_name = "Maximum 16 characters allowed"
        }
        
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Minimum 6 characters required"
        }
        
        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/^\S+@\S+$/i.test(formData.email)) {
            newErrors.email = "Invalid email format"
        }
        
        if (!formData.number) {
            newErrors.number = "Mobile number is required"
        } else if (!/^[0-9]{10}$/.test(formData.number)) {
            newErrors.number = "Enter 10-digit mobile number"
        }
        
        if (!formData.gender) {
            newErrors.gender = "Gender is required"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validate()) return
        
        try {
            const res = await fetch(apiRegister, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const result = await res.json()
            console.log('User Added', result)
            alert('Registration Successfully completed!!')
            navigate('/')
        } catch (error) {
            console.error('Error adding User:', error.message)
            alert("Failed to Add User")
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleLoginClick = () => {
        navigate('/')
    }

    return (
        <div className="register-container">
            <div className="register-main-card">
                {/* Left Side - Sneaker Image */}
                <div className="register-left-section">
                    <div className="register-left-overlay"></div>
                    <div className="register-left-content">
                        <svg 
                            className="register-sneaker-svg"
                            viewBox="0 0 200 200" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M180 120C180 120 170 110 150 110C130 110 120 115 110 115C100 115 90 110 70 110C50 110 40 115 30 120L20 130L25 140L35 145C35 145 45 150 65 150C85 150 95 145 110 145C125 145 135 150 150 150C165 150 175 145 180 140V120Z" fill="white" stroke="black" strokeWidth="3"/>
                            <ellipse cx="110" cy="115" rx="70" ry="25" fill="#E5E7EB" stroke="black" strokeWidth="3"/>
                            <path d="M60 105L80 90L120 90L140 105" stroke="black" strokeWidth="3" fill="none"/>
                            <circle cx="90" cy="100" r="8" fill="black"/>
                            <circle cx="130" cy="100" r="8" fill="black"/>
                            <path d="M40 115C40 115 50 95 70 85C90 75 120 75 140 85C160 95 170 115 170 115" stroke="black" strokeWidth="3" fill="none"/>
                            <path d="M180 125L175 135L165 142C165 142 155 147 145 147" stroke="black" strokeWidth="2" fill="none"/>
                        </svg>
                        <h1 className="register-brand-title">Sneakify</h1>
                        <p className="register-brand-tagline">Step Into Style</p>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="register-right-section">
                    <div className="register-form-container">
                        <div className="register-header">
                            <h2 className="register-welcome-title">Create Account</h2>
                            <p className="register-welcome-subtitle">Join Sneakify and start your journey</p>
                        </div>

                        <div>
                            <div className="register-form-group">
                                <label className="register-label">User Name</label>
                                <input
                                    type="text"
                                    name="user_name"
                                    value={formData.user_name}
                                    onChange={handleChange}
                                    placeholder="Enter your username"
                                    className="register-input"
                                />
                                {errors.user_name && (
                                    <p className="register-error-text">{errors.user_name}</p>
                                )}
                            </div>

                            <div className="register-form-group">
                                <label className="register-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="register-input"
                                />
                                {errors.password && (
                                    <p className="register-error-text">{errors.password}</p>
                                )}
                            </div>

                            <div className="register-form-group">
                                <label className="register-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="register-input"
                                />
                                {errors.email && (
                                    <p className="register-error-text">{errors.email}</p>
                                )}
                            </div>

                            <div className="register-form-group">
                                <label className="register-label">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    placeholder="Enter 10-digit mobile number"
                                    className="register-input"
                                />
                                {errors.number && (
                                    <p className="register-error-text">{errors.number}</p>
                                )}
                            </div>

                            <div className="register-form-group">
                                <label className="register-label">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="register-select"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="register-error-text">{errors.gender}</p>
                                )}
                            </div>

                            <div className="register-button-group">
                                <button
                                    onClick={handleSubmit}
                                    className="register-button"
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        <div className="register-login-text">
                            Already have an account?
                            <button 
                                className="register-login-link"
                                onClick={handleLoginClick}
                            >
                                Login here
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register