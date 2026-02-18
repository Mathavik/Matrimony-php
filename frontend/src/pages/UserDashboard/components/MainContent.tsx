import React from 'react';
import DefaultPage from '../pages/DefaultPage';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import UserBioData from '../pages/UserBioData';
import UserContact from '../pages/UserContact';
import UserFAQ from '../pages/UserFAQ';
import UserHelp from '../pages/UserHelp';
import UserSuccess from '../pages/UserSuccess';
import UserRequest from '../pages/UserRequest';
import ProfilePage from '../pages/profilePage';
import ProfileDetails from '../pages/UserProfileDetails';


interface MainContentProps {
  activeSection: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'profilepage':
        return <ProfilePage />;

      case 'BioData':
        return <UserBioData />;
      case 'UserContact':
        return <UserContact />;
      case 'FAQ':
        return <UserFAQ />;
      case 'UserHelp':
        return <UserHelp />;
      case 'UserSuccess':
        return <UserSuccess />;
      case 'UserRequests':
        return <UserRequest />;
      case 'UserProfileDetails':
        return <ProfileDetails />;
      default:
        return <DefaultPage section={activeSection} />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      {renderContent()}
    </main>
  );
};
export default MainContent;