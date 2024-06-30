import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { MegaMenu } from 'primereact/megamenu';
import Feed from './components/Feed';
import Profile from './components/Profile';
import './App.css'; // Import your custom CSS for additional styling
import { useTheme } from './components/ThemeContext';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
function App() {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  const items = [
    { label: 'Feed', icon: 'pi pi-box', command: () => navigate('/') },
    { label: 'Profile', icon: 'pi pi-user', command: () => navigate('/profile/1') },
    {
      label: 'Theme',
      icon: 'pi pi-palette',
      command: toggleTheme
    },
  ];

  return (
      <div className="App">
        <header>
          <MegaMenu model={items} />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
