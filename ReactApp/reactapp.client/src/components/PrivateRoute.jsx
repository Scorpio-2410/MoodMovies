import { Navigate } from "react-router-dom";

function PrivateRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    // Redirect to login if the user is not logged in
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;