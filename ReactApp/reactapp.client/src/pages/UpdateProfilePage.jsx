import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateProfilePage = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emoji, setEmoji] = useState("😡");
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    userId: "",
    fullName: "",
    email: "",
    bio: "",
    userName: "",
    dob: "",
  });

  const password = watch("newPassword");

  // Fetch user data and populate form
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/profile-fetch", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData(response.data);
        reset(response.data);  // Populate form with the fetched user data
      } catch (error) {
        console.error("Error fetching user data", error);
        toast.error("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, [reset]);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Password strength logic
  const validatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);

    if (strength === 4) setEmoji("😁");
    else if (strength === 3) setEmoji("😐");
    else if (strength === 2) setEmoji("😞");
    else setEmoji("😡");
  };

  const handlePasswordChange = (e) => validatePasswordStrength(e.target.value);

  // Handle form submission for updating profile
  const handleSubmitForm = async (data) => {
    toast.dismiss(); // Clear any previous toasts

    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
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
        toast.success("Profile updated successfully");
        reset({ ...userData, newPassword: "", confirmPassword: "" });  // Reset form fields
      }
    } catch (error) {
      console.error("Error updating profile", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Failed to update profile.");
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
        });
        toast.success("Profile deleted successfully.");
        navigate("/");  // Navigate back to home page after deletion
      } catch (error) {
        console.error("Error deleting profile", error);
        toast.error("Failed to delete profile.");
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="block w-full mt-1 px-4 py-2 border rounded-md"
              />
              <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-3">
                {showConfirmPassword ? "🤐" : "🧐"}
              </button>
            </div>
          </div>

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


