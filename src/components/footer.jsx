import { useState, useEffect } from 'react'
export default function Footer() {
  const [count, setCount] = useState(-1)
  /* Import Enviornment Variables from a file */
  const greeting = import.meta.env.VITE_GREETING  
  /* Fetch the IP address from the API */
  //const apiUrl = import.meta.env.VITE_API_URL
  const [ipAddress, setIpAddress] = useState('')
  useEffect(() => {
    const fetchIpAddress = async () => {
      const apiUrl = import.meta.env.VITE_API_URL_IP;
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
    <footer>
      <p>Your Ip Address is {ipAddress}</p>
      <p>&copy; 2026 Invictus. All rights reserved.</p>
    </footer>
  );
}
