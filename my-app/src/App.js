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
  // Initialize view state, check if there's a logged in user in localStorage
  const [view,setView]=useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? 'dashboard' : 'login';
  });
  
  // Initialize user state from localStorage
  const [user,setUser]=useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Initialize users from localStorage
  const [users,setUsers]=useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : {};
  });

  // Debug function to log current users
  const logUsers = () => {
    console.log('Current users:', users);
  };

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
      const updatedUsers = {...users, [username]: newUser};
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      const userWithYear = {...newUser, username, year: computeYear(credits), loginCount: 1};
      setUser(userWithYear);
      localStorage.setItem('currentUser', JSON.stringify(userWithYear));
      setView('dashboard');
      return {success:true};
    }

    // login flow
    console.log('Login attempt:', { username, password: '***' });
    console.log('Available users:', users);
    
    const existing = users[username];
    if(!existing){
      console.log('User not found:', username);
      return {success:false, message: 'Invalid username.'};
    }
    if(existing.password !== payload.password){
      console.log('Password mismatch for user:', username);
      return {success:false, message: 'Invalid password.'};
    }
    
    const nextCount = (existing.loginCount || 0) + 1;
    const updated = {...existing, loginCount: nextCount};
    const updatedUsers = {...users, [username]: updated};
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const userWithYear = {...updated, username, year: computeYear(updated.credits), loginCount: nextCount};
    setUser(userWithYear);
    localStorage.setItem('currentUser', JSON.stringify(userWithYear));
    setView('dashboard');
    console.log('Login successful:', username);
    return {success:true};
  }

  function handleLogout(){
    setUser(null);
    localStorage.removeItem('currentUser');
    setView('login');
  }

  // Initialize with a test account if no users exist in localStorage
  React.useEffect(() => {
    if (Object.keys(users).length === 0) {
      const testUser = {
        'test': {
          username: 'test',
          password: 'Test123!',
          name: 'Test User',
          major: 'Computer Science',
          credits: 60,
          loginCount: 0,
          email: 'test@njit.edu'
        }
      };
      setUsers(testUser);
      localStorage.setItem('users', JSON.stringify(testUser));
      console.log('Initialized test account:', testUser);
    }
  }, [users]);

  // Log users state changes
  React.useEffect(() => {
    console.log('Users state updated:', users);
  }, [users]);

  return (
    <div className="App">
      {view === 'login' && <Login onSwitch={setView} onLogin={handleLogin} />}
      {view === 'signup' && <Signup onSwitch={setView} onLogin={handleLogin} />}
      {view === 'dashboard' && <Dashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
