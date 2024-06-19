import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../styles/SignUp.css";
const Signup = () =>{
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [firstname,setFirstName]= useState("");
    const [lastname,setLastName]= useState("");
    const [username,setUsername]= useState("");
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: "post",
                body: JSON.stringify({ firstname, lastname, username, email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            console.warn(result);
            if (response.ok) {
                navigate('/home');
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(t("Internal server error"));
        }
    }
    return(
        <div id="main"><br/> <br/>
            <h1 id='title'>{t('signup.title')}</h1><br/><br/>
            <form onSubmit={handleSignUp} name="regForm" class="form-container">
                <div class="column"><div>
                    <input type="text" name="firstName" id="regforms_" 
                        placeholder={t('signup.firstname')} value={firstname}
                        onChange={(e) => setFirstName(e.target.value)} /><br /><br />
                    <input type="text" name="lastName" id="regforms_" 
                        placeholder={t('signup.lastname')} value={lastname}
                        onChange={(e) => setLastName(e.target.value)}  /><br /> <br />
                    <input type="text" name="username" id="regforms_" 
                        placeholder={t('signup.username')} value={username}
                        onChange={(e) => setUsername(e.target.value)} required /><br /> <br />
                </div>
                <div>
                    <input type="email" name="email" id="regforms_" 
                        placeholder={t('signup.email')} value={email}
                        onChange={(e) => setEmail(e.target.value)} required /><br /><br />
                    <input type="password" name="password_" id="regforms_" 
                        placeholder={t('signup.password')} value={password}
                        onChange={(e) => setPassword(e.target.value)} required /><br /><br />
                    <input type="password" name="confirmPassword" id="regforms_" 
                        placeholder={t('signup.confirmpassword')} value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} required /><br /><br />
                </div></div><br /><br />
                {errorMessage && <p>{errorMessage}</p>}<br />
                <button id="regforms" type='submit'>{t('signup.confirm')}</button>
            </form>
        </div>
    );
};

export default Signup;