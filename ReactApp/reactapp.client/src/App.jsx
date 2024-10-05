import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage.jsx";
import WeatherPage from "./pages/WeatherPage";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/home" element={<HomePage />} />
          {/* <Route path="/my-list" element={<MyMovieListPage />} />*/}
          <Route path="/weather" element={<WeatherPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
