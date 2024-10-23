import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const UpdateProfilePage = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emoji, setEmoji] = useState("😡");
  const [submitted, setSubmitted] = useState(false); // Track if form is submitted
  const [validationErrors, setValidationErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const [userData, setUserData] = useState({
    userId: "",
    fullName: "",
    email: "",
    bio: "",
    userName: "",
    dob: "",
  });

  const password = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  // Fetch user data and populate form
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/user/profile-fetch", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserData(response.data);
      reset(response.data);  // Populate form with the fetched user data
    } catch (error) {
      console.error("Error fetching user data", error);
      alert("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [reset]);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Reset password-related fields if no password is entered
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setEmoji("😡");
      setValidationErrors({
        minLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false
      });
    }
  }, [password]);

  // Password validation logic
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

    if (strength === 4) setEmoji("😁");
    else if (strength === 3) setEmoji("😐");
    else if (strength === 2) setEmoji("😞");
    else setEmoji("😡");
  };

  const handlePasswordChange = (e) => validatePasswordStrength(e.target.value);

  // Handle form submission for updating profile
  const handleSubmitForm = async (data) => {
    setSubmitted(true); // Mark form as submitted

    // If a new password is provided, validate the confirm password
    if (data.newPassword) {
      if (data.newPassword !== data.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      // Validate password strength
      if (!validationErrors.minLength || !validationErrors.hasUppercase || !validationErrors.hasNumber || !validationErrors.hasSpecialChar) {
        alert("Password does not meet the requirements.");
        return;
      }
    }

    const bioToSend = data.bio !== userData.bio ? data.bio : null; // Send bio if changed

    try {
      setLoading(true);

      const response = await axios.put(
        "/api/user/profile-update",
        {
          userId: userData.userId,
          bio: bioToSend,  // Send bio if changed
          newPassword: data.newPassword || null,  // Send new password if provided
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully.");
        reset({ ...userData, newPassword: "", confirmPassword: "" });  // Reset form fields
        fetchUserData(); // Refetch user data to reflect updates
      }
    } catch (error) {
      console.error("Error updating profile", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (confirmation) {
      try {
        setIsDeleting(true);

        await axios.delete("/api/user/profile-delete", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: { IsConfirmed: true }, // Send the confirmation flag in the request
        });

        localStorage.removeItem("token"); // Remove the token or any session data
        alert("Profile deleted successfully.");
        window.location.href = "https://localhost:5173/";
      } catch (error) {
        console.error("Error deleting profile", error);
        alert(error.response?.data?.message || "Failed to delete profile.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto mt-8">
      <h1 className="text-4xl font-bold text-center mb-8">Update Profile</h1>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && (
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name (Read-Only)</label>
            <input
              type="text"
              value={userData.fullName}
              className="block w-full mt-1 px-4 py-2 border rounded-md bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Read-Only)</label>
            <input
              type="email"
              value={userData.email}
              className="block w-full mt-1 px-4 py-2 border rounded-md bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio (Optional)</label>
            <textarea
              {...register("bio")}
              defaultValue={userData.bio}
              className="block w-full mt-1 px-4 py-2 border rounded-md"
            />
            {errors.bio && <span className="text-red-500">Bio cannot be empty</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username (Read-Only)</label>
            <input
              type="text"
              value={userData.userName}
              className="block w-full mt-1 px-4 py-2 border rounded-md bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth (Read-Only)</label>
            <input
              type="text"
              value={new Date(userData.dob).toLocaleDateString("en-GB")}
              className="block w-full mt-1 px-4 py-2 border rounded-md bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password (Optional)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword", { onChange: handlePasswordChange })}
                className="block w-full mt-1 px-4 py-2 border rounded-md"
              />
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-3">
                {showPassword ? "🤐" : "🧐"}
              </button>
            </div>

            {/* Password validation bullet points - only show if a password is being typed */}
            {password && (
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
            )}

            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                <div
                  className={`h-2.5 rounded-full ${
                    passwordStrength === 4 ? "bg-green-600" : 
                    passwordStrength === 3 ? "bg-yellow-500" : 
                    passwordStrength === 2 ? "bg-orange-500" : "bg-red-600"
                  }`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                />
              </div>
              <span>{emoji}</span>
            </div>
          </div>

          {/* Only show confirm password if a new password is typed */}
          {password && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    validate: value => value === password || "Passwords do not match",
                  })}
                  className="block w-full mt-1 px-4 py-2 border rounded-md"
                />
                <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-3">
                  {showConfirmPassword ? "🤐" : "🧐"}
                </button>
                {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          <button
            type="button"
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors mt-4"
            onClick={handleDeleteUser}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Profile"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateProfilePage;
