import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./components/Login";
import BioData from "./pages/BioData";
import ProfileDetails from "./pages/ProfileDetails";
import Contact from "./pages/contact";
import Register from "./components/Register";
import FaqPage from "./pages/home/FAQ";
import PremiumPayment from "./pages/PremiumPayment";
import ProfilePage from "./pages/profilePage";
import AdminPage from "./pages/Admin/admin";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminRoute from './components/AdminRoute';
import RequestManager from "./pages/Request";
import MyConnected from "./pages/MyConnected";
import SuccessStory from "./pages/Success Story";
import StoryDetail from "./pages/StoryDetail-Page";
import Help from "./pages/Help";
import UserDashboard from "./pages/UserDashboard/storytelling_dashboard";
import Signin from "./components/signin";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Routes WITHOUT Layout (no header/footer) */}
          <Route path="/myprofile" element={<ProfilePage />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Routes WITH Layout (has header/footer) */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signin" element={<Layout><Signin /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/brides&groom" element={<Layout><BioData /></Layout>} />
          <Route path="/profiledetails/:id" element={<Layout><ProfileDetails /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/premiumpayment" element={<Layout><PremiumPayment /></Layout>} />
          <Route path="/faq" element={<Layout><FaqPage /></Layout>} />
          <Route path="/requestmanager" element={<Layout><RequestManager /></Layout>} />
          <Route path="/myconnected" element={<Layout><MyConnected /></Layout>} />
          <Route path="/share-your-story" element={<Layout><SuccessStory /></Layout>} />
          <Route path="/story/:id" element={<Layout><StoryDetail /></Layout>} />
          <Route path="/help" element={<Layout><Help /></Layout>} />
          

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;