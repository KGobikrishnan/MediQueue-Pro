import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  [ROLES.ADMIN]: {
    id: 'usr-admin-1',
    name: 'Dr. Arthur Sterling',
    email: 'admin@mediqueue.pro',
    role: ROLES.ADMIN,
    title: 'Hospital Medical Director & Admin',
    pin: '1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  [ROLES.DOCTOR]: {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@mediqueue.pro',
    role: ROLES.DOCTOR,
    department: 'cardiology',
    deptName: 'Cardiology',
    roomNo: 'Room 204',
    pin: '1234',
    title: 'Senior Interventional Cardiologist',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
  },
  [ROLES.RECEPTIONIST]: {
    id: 'usr-rec-1',
    name: 'Kavitha Ramaswamy',
    email: 'reception.opd@mediqueue.pro',
    role: ROLES.RECEPTIONIST,
    title: 'Chief OPD Desk Coordinator',
    desk: 'OPD Central Desk 1',
    pin: '1234',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  [ROLES.PATIENT]: {
    id: 'usr-pat-1',
    name: 'Karthik Ramanathan',
    email: 'karthik.r@example.com',
    role: ROLES.PATIENT,
    phone: '9840112345',
    activeToken: 'CARD-101',
    pin: '1234',
    age: 54,
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mediqueue_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS[ROLES.DOCTOR];
      }
    }
    return DEMO_USERS[ROLES.DOCTOR];
  });

  const [token, setToken] = useState(() => localStorage.getItem('mediqueue_token') || 'demo_jwt_token_sample');
  const [isScreenLocked, setIsScreenLocked] = useState(false);
  const idleTimerRef = useRef(null);

  // Inactivity Auto-Lock Timer (5 mins timeout, reset on activity)
  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    // Auto-lock after 8 minutes of inactivity (or manually lock via button)
    idleTimerRef.current = setTimeout(() => {
      if (user && user.role !== ROLES.PATIENT) {
        setIsScreenLocked(true);
      }
    }, 8 * 60 * 1000);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => resetIdleTimer();

    events.forEach((evt) => window.addEventListener(evt, handleActivity));
    resetIdleTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mediqueue_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mediqueue_user');
    }
  }, [user]);

  const lockScreenNow = () => {
    setIsScreenLocked(true);
  };

  const unlockScreen = (inputPin) => {
    const correctPin = user?.pin || '1234';
    if (inputPin === correctPin || inputPin === '1234') {
      setIsScreenLocked(false);
      resetIdleTimer();
      return true;
    }
    return false;
  };

  const loginAsRole = (roleKey) => {
    const targetUser = DEMO_USERS[roleKey] || DEMO_USERS[ROLES.DOCTOR];
    setUser(targetUser);
    const mockJwt = `jwt_${roleKey.toLowerCase()}_${Date.now()}`;
    setToken(mockJwt);
    localStorage.setItem('mediqueue_token', mockJwt);
    setIsScreenLocked(false);
    return targetUser;
  };

  const loginCustom = (email, password, role) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: role || ROLES.PATIENT,
      title: `${role || 'Patient'} Account`,
      pin: '1234'
    };
    setUser(newUser);
    const mockJwt = `jwt_${Date.now()}`;
    setToken(mockJwt);
    localStorage.setItem('mediqueue_token', mockJwt);
    setIsScreenLocked(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsScreenLocked(false);
    localStorage.removeItem('mediqueue_token');
    localStorage.removeItem('mediqueue_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isScreenLocked,
        lockScreenNow,
        unlockScreen,
        loginAsRole,
        loginCustom,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
