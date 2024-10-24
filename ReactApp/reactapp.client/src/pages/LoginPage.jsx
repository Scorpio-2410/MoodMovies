import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Import toast from sonner

export default function LoginPage({ setIsLoggedIn }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setErrorMessage('');

    try {
      const response = await fetch('/api/user/login', {
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

      // Show success toast
      toast.success("Successful Login! Redirecting to Home");

      // Delay the navigation to allow the toast to be visible
      setTimeout(() => {
        navigate('/home');
      }, 3000); // 3-second delay before redirect

    } catch (error) {
      // Show error message using toast
      toast.error('Invalid username or password');
      console.error('Error during login: ', error);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

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

          {/* Password field with eye toggle button */}
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>

        {/* Forgot Password link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-indigo-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign Up link */}
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-700">Don't have an account?</span>
          <button
            onClick={() => navigate("/register")}
            className="ml-1 text-sm text-indigo-600 hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
