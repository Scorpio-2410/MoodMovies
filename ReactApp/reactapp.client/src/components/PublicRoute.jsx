import { Navigate } from "react-router-dom";

function PublicRoute({ isLoggedIn, children }) {
  if (isLoggedIn) {
    // Redirect to home if the user is logged in
    return <Navigate to="/home" />;
  }

  return children;
}

export default PublicRoute;
