/**
 * Polyphonic Hospital Chime synthesizer via Web Audio API (No external sound file needed!)
 */
export const playHospitalChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Classic 3-tone Airport / Hospital Chime (F5 -> A5 -> C6)
    playTone(698.46, now, 0.45);
    playTone(880.00, now + 0.25, 0.45);
    playTone(1046.50, now + 0.55, 0.9);
  } catch (err) {
    console.warn('Audio chime playback failed:', err);
  }
};

/**
 * Text-To-Speech announcement for hospital waiting room display
 */
export const announceToken = (tokenNumber, patientName, roomNo, doctorName) => {
  if (!('speechSynthesis' in window)) return;

  // Play chime first
  playHospitalChime();

  setTimeout(() => {
    try {
      window.speechSynthesis.cancel(); // Stop any overlapping voice

      const cleanToken = tokenNumber.replace('-', ' ');
      const text = `Attention please. Token number ${cleanToken}, ${patientName ? `patient ${patientName},` : ''} please proceed to ${roomNo || 'the consultation room'}${doctorName ? `, with ${doctorName}` : ''}.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      // Try selecting an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Female')));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, 1000);
};
