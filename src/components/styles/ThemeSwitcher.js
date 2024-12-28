import React, { useState, useEffect } from 'react';
import './App.css';
import './Main.css';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }, []);

    return (
        <div className="theme-switcher" >
            <button onClick={() => setTheme('light')}>
                <img src="/../materials/light.png" alt="light" style={{ width: '25px' }} />
            </button>
            <button onClick={() => setTheme('dark')}>
                <img src="/../materials/dark.png" alt="dark" style={{ width: '25px' }} />
            </button>
            <button onClick={() => setTheme('contrast')}>
                <img src="/../materials/contrast.png" alt="contrast" style={{ width: '25px' }} />
            </button>
        </div>
    );
};

export default ThemeSwitcher;