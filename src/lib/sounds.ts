// Sound utility for Pomodoro timer
// Using Web Audio API to create simple sound effects

class SoundManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize AudioContext only in browser
    if (typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    }
  }

  /**
   * Play a click sound (short beep)
   */
  playClick() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 800; // Hz
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.1
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Play a switch sound (two-tone)
   */
  playSwitch() {
    if (!this.audioContext) return;

    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.frequency.value = 600;
    oscillator2.frequency.value = 900;
    oscillator1.type = "sine";
    oscillator2.type = "sine";

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.15
    );

    oscillator1.start(this.audioContext.currentTime);
    oscillator2.start(this.audioContext.currentTime + 0.05);
    oscillator1.stop(this.audioContext.currentTime + 0.15);
    oscillator2.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Play a completion bell sound (pleasant chime)
   */
  playBell() {
    if (!this.audioContext) return;

    const frequencies = [523.25, 659.25, 783.99]; // C, E, G chord
    const currentTime = this.audioContext.currentTime;

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = freq;
      oscillator.type = "sine";

      const startTime = currentTime + index * 0.1;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.8);
    });
  }

  /**
   * Play an alarm sound (repeating beeps)
   */
  playAlarm() {
    if (!this.audioContext) return;

    const beepCount = 3;
    const beepDuration = 0.2;
    const beepGap = 0.15;

    for (let i = 0; i < beepCount; i++) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 880; // A5 note
      oscillator.type = "square";

      const startTime =
        this.audioContext.currentTime + i * (beepDuration + beepGap);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.setValueAtTime(0.3, startTime + beepDuration - 0.01);
      gainNode.gain.linearRampToValueAtTime(0, startTime + beepDuration);

      oscillator.start(startTime);
      oscillator.stop(startTime + beepDuration);
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
