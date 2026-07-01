import { useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
/* Import assets from a file */
import InvictusLogo from './assets/image_29f93cdf.png'

/* Import styles from a file */
import './App.css'

/* Import components from a file */
import React, { useEffect } from 'react';

import Header from './components/header.jsx'
import Footer from './components/footer.jsx'

/* Define the App component */
function App() {
  const [count, setCount] = useState(0)
  /* Import Enviornment Variables from a file */
  const greeting = import.meta.env.VITE_GREETING
  
  /* Fetch the IP address from the API */
  //const apiUrl = import.meta.env.VITE_API_URL
  const [ipAddress, setIpAddress] = useState('')
  useEffect(() => {
    const fetchIpAddress = async () => {
      const apiUrl = import.meta.env.VITE_API_URL
      
      try {
        const response = await fetch(`${apiUrl}?format=json`);
        if (!response.ok) {
          throw new Error(`API error! status: ${response.status}`);
        }
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        setIpAddress('Error fetching IP address');
        console.error('Error fetching IP address:', error.message);
      };
    }
    fetchIpAddress();
  }, [])

  return (
    <>
      <Header />
      <img src={InvictusLogo} className="invictus" alt="Invictus logo" />
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
          <h2>{greeting}</h2>
          <h3>Your IP Address: {ipAddress}</h3>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
      <Footer />
    </>
  )
}

export default App
