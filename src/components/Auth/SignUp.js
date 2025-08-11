import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../../styles/auth.css";

const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  return regex.test(password);
};

const SignUp = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!isStrongPassword(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert('Account created successfully!');
        onAuthSuccess && onAuthSuccess();
      }, 1500);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1>Create Account</h1>
          <p>Sign up for a new account</p>
        </div>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-6">

            {/* NAME INPUT */}
            <div className="email-input-container">
              <input
                id="signup-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="login-email"
                required
              />
              <p className="error-message">{errors.name || ""}</p>
            </div>

            {/* EMAIL INPUT */}
            <div className="email-input-container">
              <input
                id="signup-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="login-email"
                required
              />
              <Mail className="email-icon-right" />
              <p className="error-message">{errors.email || ""}</p>
            </div>

            {/* PASSWORD INPUT */}
            <div className="password-input-container">
              <div className="password-field-wrapper">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="login-password"
                  required
                />
                <span
                  className="password-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  aria-label="Toggle password visibility"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setShowPassword(!showPassword);
                    }
                  }}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>
              <p className="error-message">{errors.password || ""}</p>
            </div>

            {/* CONFIRM PASSWORD INPUT */}
            <div className="password-input-container">
              <div className="password-field-wrapper">
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="login-password"
                  required
                />
                <span
                  className="password-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  role="button"
                  aria-label="Toggle confirm password visibility"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setShowConfirmPassword(!showConfirmPassword);
                    }
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>
              <p className="error-message">{errors.confirmPassword || ""}</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-button"
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="link-button"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;


