import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import SideMenu from '../SideMenu';
import Header from '../Header';
import Staff from '../Staff.components/Staff';
import Patients from '../Patients.components/Patients';
import Equipment from '../equipement.components/Equipment';
import CenterLogo from '../center.components/CenterLogo';
import './Home.css';

const Home = () => {
  const { subdomain, apiBaseUrl } = useContext(TenantContext);
  const accessToken = localStorage.getItem('tenant-token');

  useEffect(() => {
    ;
  }, [subdomain, apiBaseUrl, accessToken]);

  if (!accessToken) {
    ;
    return null; // Rely on PrivateRoute to redirect
  }

  return (
    <div className="app-container home-page"> {/* Added home-page class */}
      <Header />
      <div className="main-wrapper">
        <SideMenu />
        <main className="home-container">
          <div className="overlay" />
          <div className="home-content">
            <h1>Welcome to {subdomain}</h1>
            <p className="slogan">Empowering Health: Your Trusted Hemodialysis Hub</p>
            <CenterLogo />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;