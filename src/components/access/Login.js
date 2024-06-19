import React, { useState, useEffect, useCallback } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [googleData, setGoogleData] = useState(null);

  const handleLogin = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: "post",
        body: JSON.stringify({ login, password, googleData }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      console.log('Login response:', result);
      if (response.ok) {
        navigate('/home');
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(t('login.internalServerError'));
    }
  }, [login, password, googleData, navigate, t]);

  useEffect(() => {
    if (googleData) {
      handleLogin();
    }
  }, [googleData, handleLogin]);

  const handleGoogleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setGoogleData(decoded);
  }

  return (
    <div id="main"><br/> <br/>
      <h1 id='title'>{t('login.title')}</h1><br></br>
      <form name="regForm">
        <input type="text" name="login" id="regforms"
          placeholder={t('login.emailOrUsername')} value={login}
          onChange={(e) => setLogin(e.target.value)} required /><br></br>

        <input type="password" name="password_" id="regforms"
          placeholder={t('login.password')} value={password}
          onChange={(e) => setPassword(e.target.value)} required /><br></br>
        <button type='submit' id="regforms" onClick={handleLogin}>{t('login.confirm')}</button><br></br>
        <h3>{t('login.or')}</h3><br></br>

        <div className='App' id="regforms">
          <GoogleLogin theme='filled_black' shape='pill' width={'27%'}
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log(t('login.loginFailed'));
            }} />
        </div><br />
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
