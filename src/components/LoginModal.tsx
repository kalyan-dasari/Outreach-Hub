import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Sparkles, X, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
}

const PRESET_USERS: UserProfile[] = [
  {
    id: 'usr_1',
    name: 'Alex Morgan',
    email: 'alex@outreachhub.io',
    role: 'Founder & Lead Operator',
  },
  {
    id: 'usr_2',
    name: 'Sarah Chen',
    email: 'sarah.c@outreachhub.io',
    role: 'Student Outreach Director',
  },
  {
    id: 'usr_3',
    name: 'Marcus Vance',
    email: 'marcus@clientpartners.io',
    role: 'B2B Client Growth Specialist',
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
}) => {
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-5 text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-bold text-xs">
              OH
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Outreach Hub Identity
              </h3>
              <p className="text-[11px] text-zinc-500">
                Single Sign-On & Operator Profile
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Switcher */}
        <div className="space-y-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
            Switch Operator Persona:
          </span>
          <div className="space-y-1.5">
            {PRESET_USERS.map((usr) => (
              <button
                key={usr.id}
                onClick={() => {
                  onSwitchUser(usr);
                  setEmail(usr.email);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                  currentUser.id === usr.id
                    ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800/80'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white">{usr.name}</p>
                  <p className="text-[11px] text-zinc-500">{usr.role} • {usr.email}</p>
                </div>
                {currentUser.id === usr.id && (
                  <Check className="w-4 h-4 text-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mock Credentials Form */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 dark:text-zinc-300">
              Passkey / Secret
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none font-mono"
              />
            </div>
          </div>

          <button
            onClick={() => {
              onSwitchUser({
                ...currentUser,
                email,
              });
              onClose();
            }}
            className="w-full py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
          >
            Authenticate Session
          </button>
        </div>
      </div>
    </div>
  );
};
