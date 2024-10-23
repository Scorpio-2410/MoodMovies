import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors, reset } = useForm();
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [passwordStrength, setPasswordStrength] = useState(0); // Password strength tracking
  const [emoji, setEmoji] = useState('😡'); // Emoji based on password strength
  const navigate = useNavigate();
  const password = watch('newPassword'); // Watch for password changes

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate password strength and set emoji and color
  const validatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);

    // Set emoji and color based on strength
    if (strength === 4) {
      setEmoji('😁'); // Happy emoji for a strong password
      clearErrors("newPassword"); // Clear password validation errors
    } else if (strength === 3) {
      setEmoji('😐'); // Neutral emoji
    } else if (strength === 2) {
      setEmoji('😞'); // Sad emoji
    } else {
      setEmoji('😡'); // Angry emoji for a weak password
      setError("newPassword", {
        type: "manual",
        message: "Password is too weak, make sure it includes uppercase, number, and special character."
      });
    }
  };

  // Watch for password input changes and validate strength
  const handlePasswordChange = (e) => {
    validatePasswordStrength(e.target.value);
  };

  // Handle form submission for verification
  const onSubmitVerify = async (data) => {
    const { username, email, dob } = data;

    try {
      const response = await fetch('/api/user/verify-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, dob }),
      });

      if (response.ok) {
        setIsVerified(true);
        setUsername(username);
        reset(); // Clear the form for password input
      } else {
        setError("username", {
          type: "manual",
          message: "The provided details do not match our records."
        });
      }
    } catch (error) {
      console.error('Error verifying user: ', error);
      setError("username", {
        type: "manual",
        message: "An error occurred while verifying your details."
      });
    }
  };

  // Handle password reset
  const onSubmitPassword = async (data) => {
    const { newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match."
      });
      return;
    }

    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword }),
      });

      if (response.ok) {
        alert("Password successfully updated!");
        navigate('/login'); // Redirect to login page after successful password reset
      } else {
        setError("newPassword", {
          type: "manual",
          message: "Error resetting password. Please try again."
        });
      }
    } catch (error) {
      console.error('Error resetting password: ', error);
      setError("newPassword", {
        type: "manual",
        message: "An error occurred while resetting your password."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        {/* Verification Form */}
        {!isVerified ? (
          <form onSubmit={handleSubmit(onSubmitVerify)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter Username</label>
              <input
                type="text"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter Email</label>
              <input
                type="email"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter Date of Birth</label>
              <input
                type="date"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                {...register('dob', { required: 'Date of Birth is required' })}
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Verify Details
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmitPassword)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  {...register('newPassword', {
                    required: 'New password is required',
                    onChange: handlePasswordChange,
                    validate: (value) =>
                      /[A-Z]/.test(value) &&
                      /[0-9]/.test(value) &&
                      /[^A-Za-z0-9]/.test(value) &&
                      value.length >= 8 ||
                      'Password must be at least 8 characters, with one uppercase letter, one number, and one special character',
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? '🤐' : '🧐'}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}

              {/* Password Strength Bar */}
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                  <div
                    className={`h-2.5 rounded-full ${
                      passwordStrength === 4
                        ? 'bg-green-600'
                        : passwordStrength === 3
                        ? 'bg-yellow-500'
                        : passwordStrength === 2
                        ? 'bg-orange-500'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                <span>{emoji}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? '🤐' : '🧐'}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
