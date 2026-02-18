import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserDashboardHeader from "./components/Header";
import MainContent from "./components/MainContent";
import UserDashboardSidebar from "./components/Sidebar";
import { Star, FileText, HelpCircle, User, Bookmark } from "lucide-react";

const StorytellingDashboard: React.FC = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(() => {
    // If navigation state has section, use it, else default to BioData
    return location.state?.section || "BioData";
  });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent;
        const detail = ce?.detail || {};
        if (detail.id) {
          sessionStorage.setItem('selectedProfileId', String(detail.id));
        }
        if (detail.userId) {
          sessionStorage.setItem('selectedProfileUserId', String(detail.userId));
        }
        console.debug('[Dashboard] openUserProfileDetails event received', detail);
      } catch (err) {
        console.debug('[Dashboard] openUserProfileDetails event received (no detail)');
      }
      setActiveSection('UserProfileDetails');
    };
    window.addEventListener('openUserProfileDetails', handler as EventListener);
    return () => window.removeEventListener('openUserProfileDetails', handler as EventListener);
  }, []);

  // Listen for navigation events from header (e.g., bell click)
  useEffect(() => {
    const navHandler = (e: Event) => {
      try {
        const ce = e as CustomEvent;
        const detail = ce?.detail || {};
        if (detail.section) {
          setActiveSection(detail.section);
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('navigateToSection', navHandler as EventListener);
    return () => window.removeEventListener('navigateToSection', navHandler as EventListener);
  }, []);

  // Sidebar Menu Items
  const menuItems = [
    { id: "profilepage", label: "profilepage", icon: <Bookmark /> },
    { id: "BioData", label: "BioData", icon: <Star /> },
    { id: "UserContact", label: "Contact Us", icon: <FileText /> },
    { id: "FAQ", label: "FAQ", icon: <HelpCircle /> },
    { id: "UserHelp", label: "Help", icon: <HelpCircle /> },
    { id: "UserSuccess", label: "Success Stories", icon: <Star /> },
    { id: "UserRequests", label: "userRequests", icon: <FileText /> },
  ];

  return (
    <div className={`h-screen flex ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <UserDashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        menuItems={menuItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <UserDashboardHeader
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
        />

        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
};

export default StorytellingDashboard;
