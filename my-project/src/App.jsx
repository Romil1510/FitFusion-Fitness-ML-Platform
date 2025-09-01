// App.jsx
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import MLForm from "./pages/MLForm.jsx";
import CoachSignup from "./components/Coach/CoachSignup.jsx";
import CoachLogin from "./components/Coach/CoachLogin.jsx";
import CoachDashboard from "./components/CoachDashboard.jsx";

// ✅ Wrapper to control Navbar visibility
function Layout({ children }) {
  const location = useLocation();

  // Hide navbar on coach pages
  const hideNavbarOnRoutes = ["/coach/login", "/coach/signup", "/coach/dashboard"];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/ml-form" element={<MLForm />} />
          <Route path="/coach/signup" element={<CoachSignup />} />
          <Route path="/coach/login" element={<CoachLogin />} />
          <Route path="/coach/dashboard" element={<CoachDashboard />} />
        </Routes>
        <ToastContainer />
      </Layout>
    </Router>
  );
}

export default App;
