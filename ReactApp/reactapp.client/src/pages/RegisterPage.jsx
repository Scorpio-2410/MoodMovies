import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onSubmit", // Validate form only on submit
    reValidateMode: "onChange", // Revalidate fields when their value changes
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // Keep track of password strength
  const [emoji, setEmoji] = useState("😡"); // Set initial emoji to angry
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = (data) => {
    console.log("Signup Data: ", data);
    // Simulate user creation by logging the form data
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate password and calculate strength
  const validatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);

    // Set emoji and color based on strength
    if (strength === 4) {
      setEmoji("😁"); // Green with a happy emoji
    } else if (strength === 3) {
      setEmoji("😐"); // Yellow with neutral emoji
    } else if (strength === 2) {
      setEmoji("😞"); // Orange with sad emoji
    } else {
      setEmoji("😡"); // Red with angry emoji
    }
  };

  // Watch for password input changes and validate strength
  const handlePasswordChange = (e) => {
    validatePasswordStrength(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        <form
          onSubmit={handleSubmit(onSubmit)} // Handle form submission and validation
          className="space-y-4"
        >
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("fullName", { required: "Full Name is required" })}
            />
            {errors.fullName && <span className="text-red-500">{errors.fullName.message}</span>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("dob", {
                required: "Date of Birth is required",
                validate: (dob) => {
                  const birthDate = new Date(dob);
                  const today = new Date();
                  const age = today.getFullYear() - birthDate.getFullYear();
                  return age >= 8 || "You must be at least 8 years old.";
                },
              })}
            />
            {errors.dob && <span className="text-red-500">{errors.dob.message}</span>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>

          {/* Username */}
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
                {...register("password", {
                  required: "Password is required",
                  onChange: handlePasswordChange,
                  validate: (value) =>
                    /[A-Z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[^A-Za-z0-9]/.test(value) &&
                    value.length >= 8 ||
                    "Password must be at least 8 characters, with one uppercase letter, one number, and one special character",
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "🤐" : "🧐"}
              </button>
            </div>
            {errors.password && (
              <ul className="text-red-500 mt-2 list-disc list-inside">
                <li>Password must be at least 8 characters</li>
                <li>Password must contain at least one uppercase letter</li>
                <li>Password must contain at least one number</li>
                <li>Password must contain at least one special character</li>
              </ul>
            )}

            {/* Password Strength Bar */}
            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                <div
                  className={`h-2.5 rounded-full ${
                    passwordStrength === 4
                      ? "bg-green-600"
                      : passwordStrength === 3
                      ? "bg-yellow-500"
                      : passwordStrength === 2
                      ? "bg-orange-500"
                      : "bg-red-600"
                  }`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                ></div>
              </div>
              <span>{emoji}</span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
          </div>

          {/* Submit button */}
          <div>
            <input
              type="submit"
              value="Sign Up"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            />
          </div>
        </form>

        {/* Link to go back to login */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-700">Already a member?</span>
          <button onClick={() => navigate("/login")} className="ml-1 text-sm text-indigo-600 hover:underline">
            Login instead
          </button>
        </div>
      </div>
    </div>
  );
}



