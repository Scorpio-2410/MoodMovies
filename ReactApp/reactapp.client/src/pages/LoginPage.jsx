import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function LoginPage({ setIsLoggedIn }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State to handle errors
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Clear previous error messages
    setErrorMessage('');

    try {
      // Send login request to the backend
      const response = await fetch('/api/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: data.username,
          userPassword: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();

      // Save token to localStorage
      localStorage.setItem('token', result.token);

      // Set the user as logged in
      setIsLoggedIn(true);

      // Navigate to the /home page on successful login
      navigate('/home');
    } catch (error) {
      // Set error message for failed login
      setErrorMessage('Invalid username or password');
      console.error('Error during login: ', error);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignupClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username field */}
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && <span className="text-red-500">{errors.username.message}</span>}
          </div>

          {/* Password field with eye button */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "🤐" : "🧐"}
              </button>
            </div>
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>

          {/* Submit button */}
          <div>
            <input
              type="submit"
              value="Login"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            />
          </div>
        </form>

        {/* Links for Signup and Forgot Password */}
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <div className="mt-2 text-center">
          <span className="text-sm text-gray-700">Don't have an account?</span>
          <button onClick={handleSignupClick} className="ml-1 text-sm text-indigo-600 hover:underline">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;