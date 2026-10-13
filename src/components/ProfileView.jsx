import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Building,
  LogOut,
  CalendarCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function ProfileView({
  myRegistrationsCount = 0,
  onPromptLogout
}) {
  const { currentUser, userProfile, isOrganizer } = useAuth();

  const name = userProfile?.name || currentUser?.displayName || 'Student Maker';
  const email = userProfile?.email || currentUser?.email || 'N/A';
  const role = userProfile?.role || (isOrganizer ? 'organizer' : 'student');
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="tab-pane-fade space-y-8">
      {/* Top Banner */}
      <div className="pb-4 border-b-2 border-[#4C4541]/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AEAC78]/25 border border-[#4C4541]/30 text-[#4C4541] text-xs font-mono font-bold tracking-wider uppercase mb-2">
          <span>[ 04 / ID ] · MAKER IDENTITY</span>
        </div>
        <h2 className="font-condensed text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#4C4541] uppercase">
          Makerspace Member Profile
        </h2>
        <p className="font-editorial italic text-sm sm:text-base text-[#4C4541]/80 mt-1 max-w-2xl font-normal">
          College of Engineering Trikaripur · Official makerspace credentials and activity summary.
        </p>
      </div>

      <div className="max-w-3xl mx-auto rounded-[28px] border-2 border-[#4C4541] bg-white p-6 sm:p-10 shadow-[5px_5px_0_#4C4541] text-[#4C4541]">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b-2 border-[#4C4541]/20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#4C4541] bg-[#FCF0DA] overflow-hidden flex items-center justify-center text-2xl sm:text-3xl font-bold font-condensed text-[#4C4541] shadow-[2.5px_2.5px_0_#4C4541] flex-shrink-0">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{initial}</span>
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h3 className="font-condensed text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#4C4541] leading-none">
                {name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541] ${role === 'organizer' || role === 'admin'
                  ? 'bg-[#F2C46A] text-[#4C4541]'
                  : 'bg-[#AEAC78] text-[#4C4541]'
                }`}>
                {role === 'organizer' ? 'Organizer' : role === 'admin' ? 'Administrator' : 'Student Maker'}
              </span>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#4C4541]/70 mt-2">{email}</p>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-xs sm:text-sm">
            <div className="flex items-center gap-3 text-[#4C4541]/70 font-mono">
              <User size={16} />
              <span>Full Name</span>
            </div>
            <span className="font-bold text-[#4C4541]">{name}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-xs sm:text-sm">
            <div className="flex items-center gap-3 text-[#4C4541]/70 font-mono">
              <Mail size={16} />
              <span>Registered Email</span>
            </div>
            <span className="font-mono text-[#4C4541]">{email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-xs sm:text-sm">
            <div className="flex items-center gap-3 text-[#4C4541]/70 font-mono">
              <Shield size={16} />
              <span>System Role</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase font-mono">{role}</span>
              {isOrganizer && (
                <span className="px-2 py-0.5 rounded-full bg-[#FCF0DA] border border-[#4C4541] text-[10px] font-mono font-bold">
                  Event Creator
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-xs sm:text-sm">
            <div className="flex items-center gap-3 text-[#4C4541]/70 font-mono">
              <Building size={16} />
              <span>Institution</span>
            </div>
            <span className="font-semibold text-right">College of Engineering Trikaripur</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-xs sm:text-sm">
            <div className="flex items-center gap-3 text-[#4C4541]/70 font-mono">
              <CalendarCheck size={16} />
              <span>Active Registrations</span>
            </div>
            <span className="font-bold font-mono text-[#4C4541]">{myRegistrationsCount} Events Confirmed</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-xs sm:text-sm">
            <div className="flex items-center gap-3 text-[#4C4541]/70 font-mono">
              <Sparkles size={16} />
              <span>Makerspace UID</span>
            </div>
            <span className="font-mono text-xs text-[#4C4541]/70">{currentUser?.uid || '—'}</span>
          </div>
        </div>

        {/* Profile Footer Actions */}
        <div className="pt-4 border-t-2 border-[#4C4541]/20 flex items-center justify-end">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 border-2 border-[#4C4541] text-xs font-bold font-mono uppercase shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
            onClick={onPromptLogout}
          >
            <LogOut size={16} />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
