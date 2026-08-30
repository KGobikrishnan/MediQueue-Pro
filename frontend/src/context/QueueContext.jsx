import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_QUEUES, INITIAL_DOCTORS, INITIAL_PRESCRIPTIONS, TOKEN_STATUS } from '../utils/constants';
import { announceToken } from '../utils/audioHelper';

const QueueContext = createContext(null);

const CHANNEL_NAME = 'mediqueue_live_sync_v2';

export const QueueProvider = ({ children }) => {
  const [queues, setQueues] = useState(() => {
    const saved = localStorage.getItem('mediqueue_queues_state');
    return saved ? JSON.parse(saved) : INITIAL_QUEUES;
  });

  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('mediqueue_doctors_state');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [prescriptions, setPrescriptions] = useState(() => {
    const saved = localStorage.getItem('mediqueue_rx_state');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [lastCalledToken, setLastCalledToken] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isWsConnected, setIsWsConnected] = useState(true);

  // Network & Online state listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Broadcast channel for multi-tab live sync
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'STATE_UPDATE') {
          if (payload.queues) setQueues(payload.queues);
          if (payload.doctors) setDoctors(payload.doctors);
          if (payload.prescriptions) setPrescriptions(payload.prescriptions);
        } else if (type === 'TOKEN_CALLED') {
          setLastCalledToken(payload);
          announceToken(payload.tokenNumber, payload.patientName, payload.roomNo, payload.doctorName, payload.priority === 'EMERGENCY');
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel fallback', e);
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  const syncAndBroadcast = (newQueues, newDoctors, newRx, broadcastCallEvent = null) => {
    if (newQueues) {
      setQueues(newQueues);
      localStorage.setItem('mediqueue_queues_state', JSON.stringify(newQueues));
    }
    if (newDoctors) {
      setDoctors(newDoctors);
      localStorage.setItem('mediqueue_doctors_state', JSON.stringify(newDoctors));
    }
    if (newRx) {
      setPrescriptions(newRx);
      localStorage.setItem('mediqueue_rx_state', JSON.stringify(newRx));
    }

    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({
        type: 'STATE_UPDATE',
        payload: {
          queues: newQueues || queues,
          doctors: newDoctors || doctors,
          prescriptions: newRx || prescriptions
        }
      });
      if (broadcastCallEvent) {
        channel.postMessage({
          type: 'TOKEN_CALLED',
          payload: broadcastCallEvent
        });
      }
      channel.close();
    } catch {
      // fallback
    }
  };

  /**
   * Action: Reorder or bump patient up the queue (Drag/Emergency priority)
   */
  const reorderQueue = (startIndex, endIndex) => {
    const result = Array.from(queues);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    syncAndBroadcast(result);
  };

  /**
   * Action: Bump patient to top of waiting queue
   */
  const bumpToTop = (tokenId) => {
    const targetIdx = queues.findIndex((q) => q.id === tokenId);
    if (targetIdx <= 0) return;
    const result = Array.from(queues);
    const [target] = result.splice(targetIdx, 1);
    // Give emergency priority if bumped manually
    target.priority = 'EMERGENCY';
    result.unshift(target);
    syncAndBroadcast(result);
  };

  /**
   * Action: Doctor calls next patient in queue
   */
  const callNextPatient = (doctorId) => {
    let updated = queues.map((q) => {
      if (q.doctorId === doctorId && q.status === TOKEN_STATUS.IN_CONSULTATION) {
        return { ...q, status: TOKEN_STATUS.COMPLETED, completedAt: new Date().toISOString() };
      }
      return q;
    });

    const waitingForDoc = updated
      .filter((q) => q.doctorId === doctorId && q.status === TOKEN_STATUS.WAITING)
      .sort((a, b) => {
        const pMap = { EMERGENCY: 3, SENIOR: 2, NORMAL: 1 };
        const pDiff = (pMap[b.priority] || 1) - (pMap[a.priority] || 1);
        if (pDiff !== 0) return pDiff;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

    if (waitingForDoc.length === 0) {
      syncAndBroadcast(updated);
      return null;
    }

    const nextToken = waitingForDoc[0];
    updated = updated.map((q) => {
      if (q.id === nextToken.id) {
        return { ...q, status: TOKEN_STATUS.IN_CONSULTATION, calledAt: new Date().toISOString() };
      }
      return q;
    });

    const activeTokenObj = {
      ...nextToken,
      status: TOKEN_STATUS.IN_CONSULTATION,
      calledAt: new Date().toISOString()
    };

    setLastCalledToken(activeTokenObj);
    announceToken(
      activeTokenObj.tokenNumber,
      activeTokenObj.patientName,
      activeTokenObj.roomNo,
      activeTokenObj.doctorName,
      activeTokenObj.priority === 'EMERGENCY'
    );
    syncAndBroadcast(updated, null, null, activeTokenObj);
    return activeTokenObj;
  };

  const recallPatient = (tokenObj) => {
    if (!tokenObj) return;
    setLastCalledToken(tokenObj);
    announceToken(tokenObj.tokenNumber, tokenObj.patientName, tokenObj.roomNo, tokenObj.doctorName, tokenObj.priority === 'EMERGENCY');
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({
        type: 'TOKEN_CALLED',
        payload: tokenObj
      });
      channel.close();
    } catch {}
  };

  const completePatient = (tokenId) => {
    const updated = queues.map((q) => (q.id === tokenId ? { ...q, status: TOKEN_STATUS.COMPLETED, completedAt: new Date().toISOString() } : q));
    syncAndBroadcast(updated);
  };

  const markNoShow = (tokenId) => {
    const updated = queues.map((q) => (q.id === tokenId ? { ...q, status: TOKEN_STATUS.NO_SHOW } : q));
    syncAndBroadcast(updated);
  };

  const addWalkInPatient = (patientData) => {
    const deptDoc = doctors.find((d) => d.id === patientData.doctorId) || doctors[0];
    const deptPrefix = patientData.deptCode || 'OPD';
    const deptTokens = queues.filter((q) => q.department === patientData.department);
    const nextSeq = deptTokens.length + 101;
    const tokenNumber = `${deptPrefix}-${nextSeq}`;

    const newToken = {
      id: `tok-${Date.now()}`,
      tokenNumber,
      patientName: patientData.patientName,
      phone: patientData.phone,
      age: parseInt(patientData.age, 10) || 30,
      gender: patientData.gender || 'Male',
      department: patientData.department,
      doctorId: deptDoc.id,
      doctorName: deptDoc.name,
      roomNo: deptDoc.roomNo,
      priority: patientData.priority || 'NORMAL',
      status: TOKEN_STATUS.WAITING,
      createdAt: new Date().toISOString(),
      symptoms: patientData.symptoms || 'General OPD Consultation',
      vitals: patientData.vitals || { bp: '120/80', pulse: '72', spo2: '99%', temp: '98.4 F', weight: '70 kg' }
    };

    const updated = [newToken, ...queues];
    syncAndBroadcast(updated);
    return newToken;
  };

  const savePrescription = (rx) => {
    const newRx = {
      id: `rx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...rx
    };
    const updated = [newRx, ...prescriptions];
    syncAndBroadcast(null, null, updated);
    return newRx;
  };

  const resetDemoData = () => {
    localStorage.removeItem('mediqueue_queues_state');
    localStorage.removeItem('mediqueue_doctors_state');
    localStorage.removeItem('mediqueue_rx_state');
    setQueues(INITIAL_QUEUES);
    setDoctors(INITIAL_DOCTORS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    syncAndBroadcast(INITIAL_QUEUES, INITIAL_DOCTORS, INITIAL_PRESCRIPTIONS);
  };

  return (
    <QueueContext.Provider
      value={{
        queues,
        doctors,
        prescriptions,
        lastCalledToken,
        isOnline,
        isWsConnected,
        reorderQueue,
        bumpToTop,
        callNextPatient,
        recallPatient,
        completePatient,
        markNoShow,
        addWalkInPatient,
        savePrescription,
        resetDemoData
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueue must be used within a QueueProvider');
  return context;
};
