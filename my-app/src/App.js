import React, {useState} from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function computeYear(credits){
  const c = Number(credits) || 0;
  if(c < 30) return 'Freshman';
  if(c < 60) return 'Sophomore';
  if(c < 90) return 'Junior';
  return 'Senior';
}

function App(){
  const [view,setView]=useState('login'); // 'login' | 'signup' | 'dashboard'
  const [user,setUser]=useState(null);
  // simple in-memory users store: { [username]: {password,name,major,credits,loginCount} }
  const [users,setUsers]=useState({});

  function handleLogin(payload){
    // payload expected: { type: 'login'|'signup', username, password, name, major, credits }
    const type = payload.type || 'login';
    const username = (payload.username || payload.email || 'anon').toString();

    if(type === 'signup'){
      // Check if username or email is already taken
      const existingUser = Object.entries(users).find(([_, userData]) => 
        userData.email === payload.email || userData.username === username
      );
      
      if(existingUser){
        const isDuplicateEmail = existingUser[1].email === payload.email;
        return {
          success: false,
          message: isDuplicateEmail ? 
            'An account with this email already exists.' :
            'This username is already taken. Please choose another.'
        };
      }
      
      const credits = Number(payload.credits) || 0;
      const newUser = {
        password: payload.password || '',
        name: payload.name || username,
        major: payload.major || '',
        credits,
        loginCount: 1,
        email: payload.email,
        username
      };
      setUsers(prev => ({...prev, [username]: newUser}));
      const year = computeYear(credits);
      setUser({...newUser, username, year, loginCount: 1});
      setView('dashboard');
      return {success:true};
    }

    // login flow
    const existing = users[username];
    if(!existing){
      return {success:false, message: 'Invalid username.'};
    }
    if(existing.password !== (payload.password || '')){
      return {success:false, message: 'Invalid password.'};
    }
    const nextCount = (existing.loginCount || 0) + 1;
    const updated = {...existing, loginCount: nextCount};
    setUsers(prev => ({...prev, [username]: updated}));
    const year = computeYear(updated.credits);
    setUser({...updated, username, year, loginCount: nextCount});
    setView('dashboard');
    return {success:true};
  }

  function handleLogout(){
    setUser(null);
    setView('login');
  }

  // Clean up user data
  React.useEffect(() => {
    setUsers(prev => {
      const copy = {...prev};
      delete copy['sharanyaraj24@gmail.com'];
      console.log('Removed test account');
      return copy;
    });
  }, []);

  return (
    <div className="App">
      {view === 'login' && <Login onSwitch={setView} onLogin={handleLogin} />}
      {view === 'signup' && <Signup onSwitch={setView} onLogin={handleLogin} />}
      {view === 'dashboard' && <Dashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
