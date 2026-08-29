import { AppNotification, NotificationType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Synthesizes a high-fidelity modern acoustic/electronic chime using Web Audio API.
 * Repair: Crisp technical dual-tone (587Hz -> 880Hz)
 * Insurance: Harmonic reassuring chord (523Hz -> 659Hz -> 783Hz)
 */
export function playNotificationSound(type: NotificationType = 'system'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, now);
    masterGain.connect(ctx.destination);

    if (type === 'repair') {
      // Tech double chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.12); // A5
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.35, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc2.connect(gain2);
      gain2.connect(masterGain);

      osc1.start(now);
      osc1.stop(now + 0.36);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.56);
    } else if (type === 'insurance') {
      // Harmonic major chord chime (C5, E5, G5)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + index * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.25, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.45);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(noteStart);
        osc.stop(noteStart + 0.46);
      });
    } else {
      // Clean single ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.41);
    }
  } catch (err) {
    // Audio context may be restricted before user interaction
    console.debug('Notification audio playback skipped:', err);
  }
}

/**
 * Checks current browser Notification API permission state
 */
export function getBrowserNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Requests browser permission for native push notifications
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return Notification.permission;
  }
}

/**
 * Dispatches a native browser notification if permissions are granted.
 */
export function sendBrowserNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    type?: NotificationType;
    onClick?: () => void;
  }
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const iconUrl = options?.type === 'insurance' 
      ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=96&auto=format&fit=crop&q=60' 
      : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=96&auto=format&fit=crop&q=60';

    const notification = new Notification(title, {
      body: options?.body || '',
      icon: options?.icon || iconUrl,
      tag: options?.tag || `elc-notify-${Date.now()}`,
      badge: iconUrl,
      requireInteraction: false,
    });

    notification.onclick = () => {
      window.focus();
      if (options?.onClick) {
        options.onClick();
      }
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Could not dispatch browser notification:', err);
    return false;
  }
}

/**
 * Creates an AppNotification object with standard ISO timestamps
 */
export function createNotification(params: {
  type: NotificationType;
  title: string;
  message: string;
  spokeTarget?: AppNotification['spokeTarget'];
  metadata?: AppNotification['metadata'];
}): AppNotification {
  return {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: params.type,
    title: params.title,
    message: params.message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
    spokeTarget: params.spokeTarget,
    metadata: params.metadata,
  };
}
