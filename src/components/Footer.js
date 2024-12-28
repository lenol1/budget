import React from 'react';

/**
 * Footer Component
 *
 * Renders a simple footer with a copyright notice.
 *
 * @author len_oli
 * 
 * @returns {React.ReactNode} - JSX element representing the footer
 */

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p>&copy; 2024 SaveySavvy</p>
      </div>
    </footer>
  );
};


const footerStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.98)',
  color: 'white',
  padding: '10px 0',
  margin: '0 32px',
  position: 'fixed',
  bottom: '0',
  width: '95%',
  borderRadius: '2em',
  textAlign: 'center'
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};
export default Footer;