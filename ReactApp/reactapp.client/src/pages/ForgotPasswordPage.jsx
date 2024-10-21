import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import "@/css/NotFoundPage.css";

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [email, setEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    let countdown;
    if (isCodeSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsCodeExpired(true);
      setGeneratedCode(null);
      setTimer(60); // Reset timer
    }

    return () => clearInterval(countdown); // Cleanup timer on unmount
  }, [isCodeSent, timer]);

  // Handle form submission to fetch email by username
  const onSubmitUsername = async (data) => {
    const { username } = data;

    // Fetch email associated with username
    try {
      const response = await fetch(`/api/user/email?username=${username}`);
      if (!response.ok) {
        throw new Error('Username not found');
      }
      const data = await response.json();
      setEmail(data.email);
      sendCode(); // Automatically send the code once email is fetched
    } catch (error) {
      alert(error.message);
    }
  };

  // Send a 6-digit code to the user's email
  const sendCode = async () => {
    const newGeneratedCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
    setGeneratedCode(newGeneratedCode);
    setIsCodeSent(true);
    setIsCodeExpired(false);

    // Send email with the code
    try {
      await fetch('/api/user/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: newGeneratedCode,
        }),
      });
      alert(`A code has been sent to ${email}`);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  };

  // Handle code verification
  const onSubmitCode = (data) => {
    const { code } = data;

    if (parseInt(code) === generatedCode) {
      alert('Code verified! You can now reset your password.');
      setIsPasswordReset(true);
    } else {
      alert('Incorrect code. Please try again.');
    }
  };

  // Handle password reset
  const onSubmitPassword = async (data) => {
    const { password } = data;

    try {
      await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      });
      alert('Password reset successfully!');
    } catch (error) {
      console.error('Error resetting password: ', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        {/* Username Form */}
        {!isCodeSent && (
          <form onSubmit={handleSubmit(onSubmitUsername)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter Username</label>
              <input
                type="text"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* Code Form */}
        {isCodeSent && !isPasswordReset && (
          <form onSubmit={handleSubmit(onSubmitCode)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter the 6-digit Code</label>
              <input
                type="text"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                {...register('code', { required: 'Code is required' })}
              />
              {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
              <button
                type="submit"
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Verify Code
              </button>
              <p className="text-sm text-gray-600 mt-2">Code expires in {timer} seconds</p>
              {isCodeExpired && (
                <button
                  type="button"
                  onClick={sendCode}
                  className="mt-2 w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        )}

        {/* New Password Form */}
        {isPasswordReset && (
          <form onSubmit={handleSubmit(onSubmitPassword)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter New Password</label>
              <input
                type="password"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                {...register('password', { required: 'Password is required', minLength: 6 })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
