import React, {useState} from 'react';
import './Auth.css';

function computeYear(credits){
  const c = Number(credits) || 0;
  if(c < 30) return 'Freshman';
  if(c < 60) return 'Sophomore';
  if(c < 90) return 'Junior';
  return 'Senior';
}

export default function Signup({onSwitch, onLogin}){
  const [form,setForm]=useState({username:'',password:'',confirmPassword:'',name:'',email:'',major:'',credits:''});
  const [error,setError]=useState('');

  function handleChange(e){
    const {name,value}=e.target;
    setForm(f=>({...f,[name]:value}));
    setError('');
  }

  function handleSubmit(e){
    e.preventDefault();
    // basic validation
    if(!form.username || !form.password || !form.email || !form.name){
      setError('Please fill in all required fields (username, password, name, email).');
      return;
    }
    // Validate NJIT email domain
    if(!/^[^@\s]+@njit\.edu$/.test(form.email)){
      setError('Please use your NJIT email address (@njit.edu).');
      return;
    }

    // confirm password match
    if(form.password !== form.confirmPassword){
      setError('Passwords do not match.');
      return;
    }

    // validate password strength
    const pwdErr = validatePassword(form.password);
    if(pwdErr){
      setError(pwdErr);
      return;
    }

    // Send signup request
    const payload = {type:'signup', username: form.username || form.email, password: form.password, name: form.name, major: form.major, credits: Number(form.credits) || 0};
    console.log('Signup:', payload);
    if(!onLogin) return;

    try {
      const res = onLogin(payload);
      if(!res.success){
        setError(res.message || 'Unable to create account.');
        return;
      }
    } catch(err) {
      setError('An error occurred while creating your account.');
    }
  }

  function validatePassword(pwd){
    if(!pwd || pwd.length < 8) return 'Password must be at least 8 characters.';
    if(!/[A-Z]/.test(pwd)) return 'Password should include at least one uppercase letter.';
    if(!/[a-z]/.test(pwd)) return 'Password should include at least one lowercase letter.';
    if(!/[0-9]/.test(pwd)) return 'Password should include at least one digit.';
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password should include at least one special character.';
    return '';
  }

  const year = computeYear(form.credits);

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-dot"/>
          <div>
            <div className="brand-title">Create your StudyBuddy account</div>
            <div className="brand-sub">Connect with classmates by major & availability</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="field">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="handle" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="strong password" />
            </div>
          </div>

          <div className="field">
            <label>Confirm password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
          </div>

          <div className="field">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
          </div>

          <div className="field">
            <label>NJIT Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="you@njit.edu" type="email" />
          </div>

          <div className="row">
            <div className="field">
              <label>Major</label>
              <input name="major" value={form.major} onChange={handleChange} placeholder="e.g., Computer Science" />
            </div>
            <div className="field">
              <label>Credits completed</label>
              <input name="credits" value={form.credits} onChange={handleChange} placeholder="e.g., 45" type="number" min="0" />
            </div>
          </div>

          <div className="note">Estimated year: <strong>{year}</strong></div>

          {error && <div className="error">{error}</div>}

          <div className="actions">
            <button className="btn" type="submit">Create account</button>
            <button type="button" className="btn ghost" onClick={()=>{setForm({username:'',password:'',confirmPassword:'',name:'',email:'',major:'',credits:''}); setError('');}}>Reset</button>
          </div>
        </form>

        <div className="switcher">
          Already have an account? <span className="linkish" onClick={()=>onSwitch('login')}>Sign in</span>
        </div>
      </div>
    </div>
  );
}
