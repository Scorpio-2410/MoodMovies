import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // Track password strength
  const [emoji, setEmoji] = useState("😡"); // Set initial emoji to angry
  const [validationErrors, setValidationErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      setErrorMessage('Username or email already exists.');
      console.error('Error during registration: ', error);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate password and calculate strength
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
      setEmoji("😁");
    } else if (strength === 3) {
      setEmoji("😐");
    } else if (strength === 2) {
      setEmoji("😞");
    } else {
      setEmoji("😡");
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {/* Password validation bullet points */}
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

          {/* Confirm Password with eye button */}
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? "🤐" : "🧐"}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 mb-1">Bio (Optional)</label>
            <textarea
              placeholder="Tell us about yourself"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("bio")}
            />
          </div>

          {/* Submit button */}
          <div>
            <input
              type="submit"
              value="Sign Up"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            />
          </div>
        </form>

        {/* Error message */}
        {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}

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

export default RegisterPage;
