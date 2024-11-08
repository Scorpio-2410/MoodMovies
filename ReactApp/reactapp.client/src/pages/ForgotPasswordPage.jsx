import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Import toast from sonner

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors, reset } = useForm();
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); 
  const [emoji, setEmoji] = useState('😡'); 
  const [validationErrors, setValidationErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const navigate = useNavigate();
  const password = watch('newPassword'); 
  const confirmPassword = watch('confirmPassword'); 

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePasswordStrength = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    setValidationErrors({
      minLength: hasMinLength,
      hasUppercase: hasUppercase,
      hasNumber: hasNumber,
      hasSpecialChar: hasSpecialChar
    });

    let strength = 0;
    if (hasMinLength) strength += 1;
    if (hasUppercase) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSpecialChar) strength += 1;

    setPasswordStrength(strength);

    if (strength === 4) {
      setEmoji('😁');
      clearErrors("newPassword");
    } else if (strength === 3) {
      setEmoji('😐');
    } else if (strength === 2) {
      setEmoji('😞');
    } else {
      setEmoji('😡');
      setError("newPassword", {
        type: "manual",
        message: "Password is too weak."
      });
    }
  };

  const handlePasswordChange = (e) => {
    validatePasswordStrength(e.target.value);
  };

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
        reset();
        toast.success('Details verified successfully!');
      } else {
        toast.error('Verification failed. Please check your details.');
      }
    } catch (error) {
      console.error('Error verifying user: ', error);
      toast.error('An error occurred while verifying your details.');
    }
  };

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
        toast.success("Password Successfully Updated! Redirecting to Login");
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error('Error resetting password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password: ', error);
      toast.error('An error occurred while resetting your password.');
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
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter Email</label>
              <input
                type="email"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                {...register('email', { required: 'Email is required' })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter Date of Birth</label>
              <input
                type="date"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                {...register('dob', { required: 'Date of Birth is required' })}
              />
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
                      value.length >= 8 || 'Password must meet the requirements',
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
              {/* Show password validation errors */}
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}

              {/* Password Validation Bullet Points */}
              <ul className="mt-2 text-sm">
                <li className={validationErrors.minLength ? "text-green-600" : "text-red-600"}>
                  Password must be at least 8 characters
                </li>
                <li className={validationErrors.hasUppercase ? "text-green-600" : "text-red-600"}>
                  Password must contain at least one uppercase letter
                </li>
                <li className={validationErrors.hasNumber ? "text-green-600" : "text-red-600"}>
                  Password must contain at least one number
                </li>
                <li className={validationErrors.hasSpecialChar ? "text-green-600" : "text-red-600"}>
                  Password must contain at least one special character
                </li>
              </ul>

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
              {/* Show confirm password validation errors */}
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
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
