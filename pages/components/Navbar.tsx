import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '@/lib/AppVars';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import refresh from '@/lib/refresh';

function NavBar() {
  const router = useRouter();
  const context = useContext(AppContext);

  const [profile, setProfile] = useState({ userName: '', avatar: '' });
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userID');
    context?.setUserID('');
    context?.setAdmin('');
    router.push('/Login');
    setProfile({ userName: '', avatar: '' });
  };

  const setTheme = () => {
    const newTheme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    context?.setTheme(newTheme);
  };

  useEffect(() => {
    if (!context?.userID) {
      return;
    }


    refresh().then((res) => { if (!res) { 
      setTimeout(() => {
      handleLogout();
      }, 500);
    } });  

    const fetchProfile = async () => {
      const response = await fetch(`/api/Profile/${context.userID}`);

      if (!response.ok) {
        return;
      }
        
      const data = await response.json();

      setProfile({
        userName: data.userName,
        avatar: data.avatar
      });
    };

    const checkAdmin = async () => {
      const response = await fetch('/api/auth/verifyAdminToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      context?.setAdmin(data.status);
    };

    fetchProfile();
    checkAdmin();
  }, [context?.userID]);

  return (
    <div>
      <ToastContainer position="top-center" autoClose={1500} theme={context?.theme}/>

      <div className="flex justify-between items-center p-4 shadow-lg mb-4" id="navbar">
        <div className="flex items-center space-x-8">

          <div className="flex items-center space-x-4">
            <button onClick={setTheme} className="bg-transparent">
            {context?.theme === 'light' ? (
              <img src="/moon.gif" alt="moon icon" width={50} height={50} />
            ) : (
              <img src="/sun.gif" alt="sun icon" width={50} height={50} />
            )}
            </button>

            <h1 className="font-serif text-3xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 text-transparent bg-clip-text animate-gradient">
            Scriptorium
            </h1>
          </div>

          {profile.userName && (
            <div className="flex items-center space-x-2 border py-2 px-4 rounded-full">
              <img
              src={`data:image/jpeg;base64,${profile.avatar}`}
              alt=""
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
              /> 
              <span className="cta-primary text-xl font-semibold font-mono">{profile.userName}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="block xl:hidden text-4xl bg-transparent text-gray-500 pb-2 p-1"
          aria-label="Toggle Menu">
          ☰
        </button>

        <nav
          className={`grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3 ${
            menuOpen ? 'block' : 'hidden'
          } xl:flex xl:flex-row xl:space-y-0`}>

            <button
              onClick={() => { router.push('/'); setMenuOpen(false); }}
              id="navButton"
              className={router.pathname === '/' ? 'active' : ''}>
              <i className="fas fa-home"></i>
            </button>

            {context?.userID && (
            <button
              onClick={() => { router.push('/Profile'); setMenuOpen(false); }}
              id="navButton"
              className={router.pathname.startsWith('/Profile') ? 'active' : ''}>
              <i className="fas fa-user"></i>
            </button>
            )}

            <button
              onClick={() => { router.push('/Runner'); setMenuOpen(false); }}
              id="navButton"
              className={router.pathname.startsWith('/Runner') ? 'active' : ''}>
              <i className="fas fa-play"></i>
            </button>

            <button
              onClick={() => { router.push('/Blogs'); setMenuOpen(false); }}
              id="navButton"
              className={router.pathname.startsWith('/Blogs') ? 'active' : ''}>
              <i className="fas fa-blog"></i>
            </button>

            <button
              onClick={() => { router.push('/Templates'); setMenuOpen(false); }}
              id="navButton"
              className={router.pathname.startsWith('/Templates') ? 'active' : ''}>
              <i className="fas fa-code"></i>
            </button>
            {context?.admin === 'True' && (
            <button
              onClick={() => { router.push('/Admin'); setMenuOpen(false); }}
              id="navButton"
              className={router.pathname.startsWith('/Admin') ? 'active' : ''}>
              <i className="fas fa-user-shield"></i>
            </button>
            )}
            <button
              onClick={handleLogout}
              id="navButton"
              className={(router.pathname.startsWith('/Logout') || router.pathname.startsWith('/Login')) ? 'active' : ''}>
              <i className={`fas ${context?.userID ? 'fa-sign-out-alt' : 'fa-sign-in-alt'}`}></i>
            </button>

        </nav>
      </div>

    </div>
  );
}

export default NavBar;