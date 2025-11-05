import React from 'react';
import './Auth.css';

export default function Dashboard({user, onLogout}){
  if(!user) return null;

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-dot"/>
          <div>
            <div className="brand-title">Welcome back, {user.name}</div>
            <div className="brand-sub">StudyBuddy dashboard</div>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <div style={{fontSize: '1.05rem', marginBottom:8}}>Hello, <strong>{user.name}</strong></div>

          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <div style={{background:'rgba(255,255,255,0.02)',padding:'12px',borderRadius:10,minWidth:120}}>
              <div style={{color:'#9aa4b2',fontSize:12}}>Year</div>
              <div style={{fontWeight:700,fontSize:16}}>{user.year || '—'}</div>
            </div>

            <div style={{background:'rgba(255,255,255,0.02)',padding:'12px',borderRadius:10,minWidth:120}}>
              <div style={{color:'#9aa4b2',fontSize:12}}>Logins</div>
              <div style={{fontWeight:700,fontSize:16}}>{user.loginCount ?? 0}</div>
            </div>
          </div>

          <div style={{marginTop:18}}>
            <button className="btn" onClick={onLogout}>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
