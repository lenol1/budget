import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

/**
 * Renders the title depending on the given option
 *
 * This function dynamically generates different header variants based on the value of the `variant` parameter.
 * Used to display headers on the login, registration, and home pages.
 *
 * @author len_oli
 * 
 * @param {Object} options - Object with options
 * @param {string} options.variant - Title display option:
 * - "login/signup": Displays links to login and registration
 * - "home": Displays the navigation links for the main page
 * @returns {React.ReactNode} - JSX element that represents the header
 */

function Header({ variant }) {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  let headerContent;

  switch (variant) {
    case "login/signup":
      headerContent = (
        <>
          <Link to="/" id="link"><h2>{t('header.login')}</h2></Link>
          <img src="/../logo512.png" alt="logo" id="logo" />
          <Link to="/signup" id="link"><h2>{t('header.signup')}</h2></Link>
        </>
      );
      break;
    case "home":
      headerContent = (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NavLink to="/home">
              <img src="/../materials/home.png" alt="home" style={{ width: '40px' }} />
              <h4>{t('header.home')}</h4>
            </NavLink>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NavLink to="/report">
              <img src="/../materials/clipboard.png" alt="report" style={{ width: '40px' }} />
              <h4>{t('header.report')}</h4>
            </NavLink>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NavLink to="/">
              <img src="/../materials/logout.png" alt="logout" style={{ width: '40px' }} />
              <h4 style={{ left: '50%' }}>{t('header.logout')}</h4>
            </NavLink>
          </div>
        </>
      );
      break;
    default:
      headerContent = null;
  }

  return (
    <div id="header" style={{ display: 'flex' }}>
      <div id="mainHComponents">
        {headerContent}
      </div>
      <div className="language-buttons">
        <button onClick={() => changeLanguage('en')} style={{ position: 'absolute' }}>EN</button><br />
        <button onClick={() => changeLanguage('uk')} style={{ position: 'absolute' }}>UA</button>
      </div>
      
    </div>
  );
}

export default Header;