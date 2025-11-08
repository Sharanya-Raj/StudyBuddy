import React, {useState} from 'react';
import './Auth.css';

export default function Login({onSwitch, onLogin}){
  const [form,setForm]=useState({username:'',password:''});
  const [error,setError]=useState('');

  function handleChange(e){
    const {name,value}=e.target;
    setForm(f=>({...f,[name]:value}));
    setError('');
  }

  function handleSubmit(e){
    e.preventDefault();
    if(!form.username || !form.password){
      setError('Please enter username and password.');
      return;
    }
    // Call parent to verify credentials and sign in
    const payload = {type:'login', username: form.username.trim(), password: form.password};
    if(!onLogin) return;

    try {
      const res = onLogin(payload);
      if(!res || !res.success){
        setError(res?.message || 'Unable to sign in.');
        return;
      }
      // Clear form and error on successful login
      setForm({username:'', password:''});
      setError('');
    } catch(err) {
      console.error('Login error:', err);
      setError('An error occurred while signing in.');
    }
  }


  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-dot"/>
          <div>
            <div className="brand-title">StudyBuddy</div>
            <div className="brand-sub">Find study partners — fast</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="your handle" />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>

          {error && <div className="error">{error}</div>}

          <div className="actions">
            <button type="submit" className="btn">Sign in</button>
            <button type="button" className="btn ghost" onClick={()=>{setForm({username:'',password:''}); setError('');}}>Clear</button>
          </div>
        </form>

        <div className="switcher">
          New to StudyBuddy? <span className="linkish" onClick={()=>onSwitch('signup')}>Create an account</span>
        </div>
      </div>
    </div>
  );
}
