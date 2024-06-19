import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p>&copy; 2024 SaveySavvy. All rights reserved.</p>
        <div style={socialMediaStyle}>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.98)',
  color: 'white',
  padding: '10px 0',
  margin: '0 30px',
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

const socialMediaStyle = {
  marginTop: '5px',
  display: 'flex',
  justifyContent: 'center',
  gap: '5px'
};

export default Footer;
