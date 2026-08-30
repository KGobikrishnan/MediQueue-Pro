/**
 * Polyphonic Hospital Chime synthesizer via Web Audio API
 * Supports Routine 1-tone / 3-tone chime AND Urgent Emergency 3-pulse drama alert
 */
export const playHospitalChime = (isEmergency = false) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration, type = 'sine', gainVal = 0.3) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;

    if (isEmergency) {
      // High-drama Rapid Triple Alert (Sawtooth / Square alert)
      playTone(880.00, now, 0.25, 'triangle', 0.5);
      playTone(880.00, now + 0.15, 0.25, 'triangle', 0.5);
      playTone(1174.66, now + 0.30, 0.6, 'sine', 0.6);
    } else {
      // Classic Harmonic Hospital Airport Chime (F5 -> A5 -> C6)
      playTone(698.46, now, 0.45, 'sine', 0.3);
      playTone(880.00, now + 0.25, 0.45, 'sine', 0.3);
      playTone(1046.50, now + 0.55, 0.9, 'sine', 0.35);
    }
  } catch (err) {
    console.warn('Audio chime playback failed:', err);
  }
};

/**
 * Text-To-Speech announcement with mobile vibration trigger
 */
export const announceToken = (tokenNumber, patientName, roomNo, doctorName, isEmergency = false) => {
  // Mobile Haptic Vibration trigger
  if ('vibrate' in navigator) {
    try {
      if (isEmergency) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } else {
        navigator.vibrate([200, 100, 200]);
      }
    } catch {}
  }

  // Play audio chime
  playHospitalChime(isEmergency);

  if (!('speechSynthesis' in window)) return;

  setTimeout(() => {
    try {
      window.speechSynthesis.cancel();

      const cleanToken = tokenNumber.replace('-', ' ');
      const prefix = isEmergency ? 'Emergency Alert. ' : 'Attention please. ';
      const text = `${prefix}Token number ${cleanToken}, ${patientName ? `patient ${patientName},` : ''} please proceed to ${roomNo || 'the consultation room'}${doctorName ? `, with ${doctorName}` : ''}.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = isEmergency ? 1.0 : 0.92;
      utterance.pitch = isEmergency ? 1.15 : 1.05;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Female')));
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, isEmergency ? 800 : 1000);
};
