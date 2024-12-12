'use client';

import { useRouter } from 'next/navigation';
import './welcome.css';

const WelcomePage = () => {
  const router = useRouter();

  return (
    <div className="welcome-container">
      <h1>Welcome to Event Management System</h1>
      <div className="button-group">
        <button onClick={() => router.push('/register')} className="button">
          Register
        </button>
        <button onClick={() => router.push('/login')} className="button">
          Login
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
