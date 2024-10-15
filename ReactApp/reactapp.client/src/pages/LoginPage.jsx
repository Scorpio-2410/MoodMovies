import { useForm } from "react-hook-form";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data: ", data);
    // Handle your login logic here (e.g., API call)
  };

  console.log(watch("username")); // Watch username input value

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username field */}
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && <span className="text-red-500">{errors.username.message}</span>}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("password", { required: "Password is required" })}
            />
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
          <a href="/signup" className="ml-1 text-sm text-indigo-600 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
