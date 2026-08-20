import { User } from '../types';
import { MOCK_USER } from './mockData';

const AUTH_STORAGE_KEY = 'dilshad_ai_user_session';

export function getStoredUser(): User | null {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading auth state:', e);
  }
  // Default to MOCK_USER for instant showcase, or logged in state
  return MOCK_USER;
}

export function saveStoredUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error writing auth state:', e);
  }
}

export async function mockLoginWithGoogle(): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const user: User = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    name: 'Google User',
    email: 'user.google@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    tier: 'Pro',
    creditsLeft: 9500,
    maxCredits: 10000,
  };
  saveStoredUser(user);
  return user;
}

export async function mockLoginWithEmail(email: string, _password: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const user: User = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    name: email.split('@')[0] || 'Dilshad User',
    email: email,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    tier: 'Pro',
    creditsLeft: 8450,
    maxCredits: 10000,
  };
  saveStoredUser(user);
  return user;
}

export async function mockSignup(name: string, email: string, _password: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const user: User = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    name: name || 'New Dilshad User',
    email: email,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    tier: 'Free',
    creditsLeft: 2000,
    maxCredits: 2000,
  };
  saveStoredUser(user);
  return user;
}

export async function mockLogout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  saveStoredUser(null);
}
