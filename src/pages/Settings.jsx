import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Shield,
  Bell,
  Lock,
  Mail,
  Check,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  Save,
  RotateCcw,
  BadgeCheck,
  Settings as SettingsIcon,
  Globe,
  Calendar,
  Tag,
  Trash2,
  Info,
  ChevronRight,
  Camera,
  Building2,
  Clock,
  ExternalLink,
  AlertTriangle,
  X,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Reusable Toggle Switch ───────────────────────────────────────────────────
const ToggleSwitch = ({ enabled, onToggle, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={label}
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer ${
      enabled
        ? 'bg-orange-500'
        : 'bg-gray-200 dark:bg-gray-700'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// ─── Password Strength Meter ──────────────────────────────────────────────────
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Too weak', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Weak', color: 'bg-orange-400' };
  if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-400' };
  if (score === 4) return { score, label: 'Good', color: 'bg-blue-400' };
  return { score, label: 'Strong', color: 'bg-green-500' };
};

const PasswordStrengthMeter = ({ password }) => {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              i <= score ? color : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${score >= 4 ? 'text-green-600 dark:text-green-400' : score >= 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}`}>
        {label}
      </p>
    </div>
  );
};

// ─── Alert Banner ─────────────────────────────────────────────────────────────
const AlertBanner = ({ type, message, onDismiss }) => {
  if (!message) return null;
  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    warning: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300'
  };
  const icons = {
    success: <CheckCircle2 size={16} />,
    error: <AlertCircle size={16} />,
    warning: <AlertTriangle size={16} />
  };
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${styles[type]}`}>
      <span className="flex-shrink-0 mt-0.5">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="flex-shrink-0 opacity-70 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  );
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setConfirmPassword('');
      setLocalError('');
      setShowPassword(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmPassword.trim()) {
      setLocalError('Please enter your password to confirm.');
      return;
    }
    setLocalError('');
    onConfirm(confirmPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Red header stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-rose-600" />

        <div className="p-6 space-y-5">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <Trash2 size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Account Permanently</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This action is <strong>irreversible</strong>. All your leads, pipeline data, and settings will be permanently deleted.
              </p>
            </div>
          </div>

          {/* Warning checklist */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 space-y-2">
            {[
              'Your account will be permanently removed',
              'All leads and pipeline data will be deleted',
              'All settings and preferences will be lost',
              'This cannot be undone — there is no recovery option'
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <X size={14} className="flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Error */}
          {localError && (
            <AlertBanner type="error" message={localError} onDismiss={() => setLocalError('')} />
          )}

          {/* Password confirmation form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Confirm Your Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDeleting || !confirmPassword}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 size={15} />
                {isDeleting ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Avatar Component ─────────────────────────────────────────────────────────
const UserAvatar = ({ name, size = 'lg' }) => {
  const initials = name
    ? name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-24 h-24 text-3xl'
  };
  // Generate a stable hue from the name
  const hue = name
    ? name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
    : 220;
  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0`}
      style={{ background: `hsl(${hue}, 60%, 45%)` }}
    >
      {initials}
    </div>
  );
};

// ─── Section Card wrapper ─────────────────────────────────────────────────────
const SectionCard = ({ title, subtitle, icon: Icon, children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden ${className}`}>
    {/* Card header stripe using orange accent */}
    <div className="px-6 md:px-8 py-5 border-b border-gray-100 dark:border-gray-700/60 flex items-start gap-3">
      {Icon && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
          <Icon size={18} />
        </div>
      )}
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="px-6 md:px-8 py-6">
      {children}
    </div>
  </div>
);

// ─── Main Settings Page ───────────────────────────────────────────────────────
const Settings = () => {
  const { user, updateUserProfile, logout, deleteAccount } = useAuth();

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState('profile');

  // ── Profile ──
  const [profileName, setProfileName] = useState(user?.name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // ── Password ──
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdVisibility, setPwdVisibility] = useState({ current: false, newPwd: false, confirm: false });
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  // ── Notifications ──
  const defaultNotifs = {
    leadAssignment: true,
    statusUpdates: true,
    taskReminders: true,
    accountAlerts: true,
    weeklyDigest: true,
    marketingUpdates: false
  };
  const [notifications, setNotifications] = useState(() => ({
    ...defaultNotifs,
    ...(user?.notificationPreferences || {})
  }));
  const [isSavingNotifs, setIsSavingNotifs] = useState(false);
  const [notifMsg, setNotifMsg] = useState({ type: '', text: '' });

  // ── CRM Preferences ──
  const defaultCrm = {
    defaultLeadStatus: 'New',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC'
  };
  const [crmPrefs, setCrmPrefs] = useState(() => ({
    ...defaultCrm,
    ...(user?.crmPreferences || {})
  }));
  const [isSavingCrm, setIsSavingCrm] = useState(false);
  const [crmMsg, setCrmMsg] = useState({ type: '', text: '' });

  // ── Delete Account ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync when user data loads
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      if (user.notificationPreferences) {
        setNotifications(prev => ({ ...prev, ...user.notificationPreferences }));
      }
      if (user.crmPreferences) {
        setCrmPrefs(prev => ({ ...prev, ...user.crmPreferences }));
      }
    }
  }, [user]);

  // Auto-dismiss messages
  const flashMsg = (setter, type, text, ms = 4500) => {
    setter({ type, text });
    setTimeout(() => setter({ type: '', text: '' }), ms);
  };

  // ── Handlers ──
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    const trimmed = profileName.trim();
    if (!trimmed) return setProfileMsg({ type: 'error', text: 'Full name is required.' });
    if (trimmed.length < 2) return setProfileMsg({ type: 'error', text: 'Name must be at least 2 characters.' });
    if (trimmed.length > 50) return setProfileMsg({ type: 'error', text: 'Name cannot exceed 50 characters.' });

    setIsSavingProfile(true);
    const res = await updateUserProfile({ name: trimmed });
    setIsSavingProfile(false);
    flashMsg(setProfileMsg, res.success ? 'success' : 'error',
      res.success ? 'Profile name updated successfully.' : (res.error || 'Failed to update profile.'));
  };

  const togglePwdVisibility = (field) =>
    setPwdVisibility(prev => ({ ...prev, [field]: !prev[field] }));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });
    const { current, newPwd, confirm } = pwdForm;
    if (!current) return setPwdMsg({ type: 'error', text: 'Current password is required.' });
    if (!newPwd || newPwd.length < 6) return setPwdMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
    if (newPwd !== confirm) return setPwdMsg({ type: 'error', text: 'New passwords do not match.' });
    if (current === newPwd) return setPwdMsg({ type: 'error', text: 'New password must differ from current password.' });

    setIsChangingPwd(true);
    const res = await updateUserProfile({ oldPassword: current, newPassword: newPwd });
    setIsChangingPwd(false);
    if (res.success) {
      setPwdForm({ current: '', newPwd: '', confirm: '' });
      flashMsg(setPwdMsg, 'success', 'Password updated securely.');
    } else {
      flashMsg(setPwdMsg, 'error', res.error || 'Failed to change password. Check your current password.');
    }
  };

  const handleSaveNotifications = async () => {
    setIsSavingNotifs(true);
    setNotifMsg({ type: '', text: '' });
    const res = await updateUserProfile({ notificationPreferences: notifications });
    setIsSavingNotifs(false);
    flashMsg(setNotifMsg, res.success ? 'success' : 'error',
      res.success ? 'Notification preferences saved.' : (res.error || 'Failed to save preferences.'));
  };

  const handleSaveCrmPrefs = async () => {
    setIsSavingCrm(true);
    setCrmMsg({ type: '', text: '' });
    const res = await updateUserProfile({ crmPreferences: crmPrefs });
    setIsSavingCrm(false);
    flashMsg(setCrmMsg, res.success ? 'success' : 'error',
      res.success ? 'CRM preferences saved.' : (res.error || 'Failed to save preferences.'));
  };

  const handleDeleteAccount = async (password) => {
    setIsDeleting(true);
    const res = await deleteAccount(password);
    setIsDeleting(false);
    if (!res.success) {
      // deleteAccount already shows toast; modal stays open to let user retry
    }
  };

  // ── Tab definitions ──
  const tabs = [
    { id: 'profile',       label: 'My Profile',       icon: User,        desc: 'Name & identity' },
    { id: 'account',       label: 'Account',          icon: Building2,   desc: 'Account details' },
    { id: 'security',      label: 'Security',         icon: Shield,      desc: 'Password & access' },
    { id: 'notifications', label: 'Notifications',    icon: Bell,        desc: 'Alerts & digests' },
    { id: 'crm',           label: 'CRM Preferences',  icon: SettingsIcon,desc: 'Defaults & formats' },
    { id: 'privacy',       label: 'Privacy & Data',   icon: Lock,        desc: 'Data & deletion' },
    { id: 'about',         label: 'About',            icon: Info,        desc: 'App info & support' }
  ];

  // ── Reusable input classes ──
  const inputClass = 'w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors';
  const inputWithIconClass = `${inputClass} pl-10`;
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  const labelClass = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5';

  const primaryBtnClass = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-sm shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  const secondaryBtnClass = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">

        {/* ── Page Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your account, security, preferences, and data.
            </p>
          </div>
          {/* User pill */}
          <div className="hidden sm:flex items-center gap-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm">
            <UserAvatar name={user?.name} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[140px]">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[140px]">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Layout ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* ── Sidebar navigation ──────────────────────────────────── */}
          <div className="md:col-span-4 lg:col-span-3 space-y-3">
            {/* Mobile: horizontal scroll tabs */}
            <div className="md:hidden overflow-x-auto pb-1 -mx-1 px-1">
              <div className="flex gap-2 w-max">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === id
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: vertical sidebar */}
            <nav className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {tabs.map(({ id, label, icon: Icon, desc }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all cursor-pointer border-l-2 ${
                      isActive
                        ? 'bg-orange-50 dark:bg-orange-900/10 border-l-orange-500 text-orange-600 dark:text-orange-400'
                        : 'border-l-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-l-gray-300 dark:hover:border-l-gray-600'
                    }`}
                  >
                    <Icon size={17} className={`flex-shrink-0 ${isActive ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-semibold leading-tight ${isActive ? '' : ''}`}>{label}</div>
                      <div className={`text-[11px] mt-0.5 ${isActive ? 'text-orange-400 dark:text-orange-500' : 'text-gray-400 dark:text-gray-600'}`}>{desc}</div>
                    </div>
                    {isActive && <ChevronRight size={15} className="flex-shrink-0 text-orange-400" />}
                  </button>
                );
              })}
            </nav>

            {/* Quick Status Card */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Account Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <BadgeCheck size={14} className="text-green-500 flex-shrink-0" />
                <span className="truncate">{user?.email || 'Authenticated'}</span>
              </div>
              <div className="text-xs">
                <span className="text-gray-400 dark:text-gray-600">Role: </span>
                <span className="font-semibold uppercase text-orange-500 dark:text-orange-400">
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Content Panel ────────────────────────────────────────── */}
          <div className="md:col-span-8 lg:col-span-9 space-y-5">

            {/* ══ SECTION: MY PROFILE ════════════════════════════════ */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <SectionCard
                  title="My Profile"
                  subtitle="Your public display name and registered account identity."
                  icon={User}
                >
                  {/* Avatar + name banner */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 mb-6 border-b border-gray-100 dark:border-gray-700/60">
                    <div className="relative group">
                      <UserAvatar name={user?.name} size="lg" />
                      <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera size={18} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {user?.name || 'Your Name'}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800/40">
                          <Check size={11} /> Verified Account
                        </span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                          {user?.role || 'user'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Alert */}
                  <AlertBanner type={profileMsg.type} message={profileMsg.text} onDismiss={() => setProfileMsg({ type: '', text: '' })} />

                  <form onSubmit={handleSaveProfile} className="space-y-5 mt-4">
                    {/* Full Name */}
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Your full name"
                          className={inputWithIconClass}
                          maxLength={50}
                          required
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1.5">
                        {profileName.length}/50 characters
                      </p>
                    </div>

                    {/* Email (read-only) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={labelClass} style={{ marginBottom: 0 }}>Registered Email</label>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800/50">
                          <Check size={10} /> Verified
                        </span>
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-500 cursor-not-allowed select-none"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1.5">
                        Email is permanently linked to your account and cannot be changed.
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700/60">
                      <button
                        type="button"
                        onClick={() => { setProfileName(user?.name || ''); setProfileMsg({ type: '', text: '' }); }}
                        disabled={isSavingProfile}
                        className={secondaryBtnClass}
                      >
                        <RotateCcw size={15} /> Reset
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className={primaryBtnClass}
                      >
                        <Save size={15} />
                        {isSavingProfile ? 'Saving…' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </SectionCard>
              </div>
            )}

            {/* ══ SECTION: ACCOUNT ═══════════════════════════════════ */}
            {activeTab === 'account' && (
              <div className="space-y-5">
                <SectionCard
                  title="Account Information"
                  subtitle="Overview of your account details and status."
                  icon={Building2}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        label: 'Account ID',
                        value: user?._id || user?.id || 'N/A',
                        mono: true,
                        truncate: true
                      },
                      {
                        label: 'Display Name',
                        value: user?.name || '—'
                      },
                      {
                        label: 'Email Address',
                        value: user?.email || '—',
                        truncate: true
                      },
                      {
                        label: 'Role',
                        value: (user?.role || 'user').toUpperCase(),
                        highlight: 'orange'
                      },
                      {
                        label: 'Account Status',
                        value: 'Active',
                        highlight: 'green',
                        dot: true
                      },
                      {
                        label: 'Member Since',
                        value: user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                          : 'N/A'
                      }
                    ].map(({ label, value, mono, truncate, highlight, dot }) => (
                      <div
                        key={label}
                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/60"
                      >
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">{label}</div>
                        <div className={`mt-1.5 text-sm font-semibold flex items-center gap-1.5 ${
                          highlight === 'orange' ? 'text-orange-500 dark:text-orange-400' :
                          highlight === 'green' ? 'text-green-600 dark:text-green-400' :
                          'text-gray-800 dark:text-gray-200'
                        } ${mono ? 'font-mono text-xs break-all' : ''} ${truncate ? 'truncate' : ''}`}>
                          {dot && <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />}
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                {/* Logout */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <LogOut size={16} className="text-gray-400" />
                      Sign Out of This Session
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Clears your authentication token and returns you to the login screen.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              </div>
            )}

            {/* ══ SECTION: SECURITY ══════════════════════════════════ */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                <SectionCard
                  title="Change Password"
                  subtitle="Passwords are hashed with bcrypt (10 salt rounds). We recommend using a strong, unique password."
                  icon={Shield}
                >
                  <AlertBanner type={pwdMsg.type} message={pwdMsg.text} onDismiss={() => setPwdMsg({ type: '', text: '' })} />

                  <form onSubmit={handleChangePassword} className="mt-4 space-y-5">
                    {/* Current Password */}
                    <div>
                      <label className={labelClass}>Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={pwdVisibility.current ? 'text' : 'password'}
                          value={pwdForm.current}
                          onChange={(e) => setPwdForm(prev => ({ ...prev, current: e.target.value }))}
                          placeholder="Enter your current password"
                          className={`${inputWithIconClass} pr-10`}
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePwdVisibility('current')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                          {pwdVisibility.current ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password + Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={pwdVisibility.newPwd ? 'text' : 'password'}
                            value={pwdForm.newPwd}
                            onChange={(e) => setPwdForm(prev => ({ ...prev, newPwd: e.target.value }))}
                            placeholder="Min. 6 characters"
                            className={`${inputWithIconClass} pr-10`}
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePwdVisibility('newPwd')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                          >
                            {pwdVisibility.newPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        <PasswordStrengthMeter password={pwdForm.newPwd} />
                      </div>

                      <div>
                        <label className={labelClass}>Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={pwdVisibility.confirm ? 'text' : 'password'}
                            value={pwdForm.confirm}
                            onChange={(e) => setPwdForm(prev => ({ ...prev, confirm: e.target.value }))}
                            placeholder="Re-enter new password"
                            className={`${inputWithIconClass} pr-10 ${
                              pwdForm.confirm && pwdForm.newPwd !== pwdForm.confirm
                                ? 'border-red-400 focus:ring-red-500'
                                : pwdForm.confirm && pwdForm.newPwd === pwdForm.confirm
                                ? 'border-green-400 focus:ring-green-500'
                                : ''
                            }`}
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePwdVisibility('confirm')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                          >
                            {pwdVisibility.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {pwdForm.confirm && (
                          <p className={`text-[11px] mt-1.5 font-medium ${
                            pwdForm.newPwd === pwdForm.confirm
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-500 dark:text-red-400'
                          }`}>
                            {pwdForm.newPwd === pwdForm.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Password requirements */}
                    <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/60 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Password requirements:</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { check: pwdForm.newPwd.length >= 6, label: 'At least 6 characters' },
                          { check: /[A-Z]/.test(pwdForm.newPwd), label: 'One uppercase letter' },
                          { check: /[0-9]/.test(pwdForm.newPwd), label: 'One number' },
                          { check: /[^A-Za-z0-9]/.test(pwdForm.newPwd), label: 'One special character' }
                        ].map(({ check, label }) => (
                          <div key={label} className="flex items-center gap-1.5 text-xs">
                            <span className={`flex-shrink-0 ${check ? 'text-green-500' : 'text-gray-300 dark:text-gray-700'}`}>
                              {check ? <CheckCircle2 size={12} /> : <X size={12} />}
                            </span>
                            <span className={check ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-700/60">
                      <button
                        type="submit"
                        disabled={isChangingPwd}
                        className={primaryBtnClass}
                      >
                        <Shield size={15} />
                        {isChangingPwd ? 'Updating…' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </SectionCard>

                {/* Security tips card */}
                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/40 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-orange-800 dark:text-orange-300">Security Recommendations</h4>
                      <ul className="mt-2 space-y-1 text-xs text-orange-700 dark:text-orange-400">
                        <li>• Use a unique password not reused on other sites</li>
                        <li>• Mix uppercase, lowercase, numbers and symbols for a strong password</li>
                        <li>• Never share your password with anyone, including support staff</li>
                        <li>• Log out of shared devices after each session</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ SECTION: NOTIFICATIONS ═════════════════════════════ */}
            {activeTab === 'notifications' && (
              <SectionCard
                title="Notification Preferences"
                subtitle="Control which CRM events trigger alerts and digests. Preferences are saved in your account."
                icon={Bell}
              >
                <AlertBanner type={notifMsg.type} message={notifMsg.text} onDismiss={() => setNotifMsg({ type: '', text: '' })} />

                <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-700/60">
                  {[
                    {
                      key: 'leadAssignment',
                      label: 'Lead Assignment Alerts',
                      desc: 'Notify when a new lead is assigned to you or created in your workspace.',
                      badge: 'CRM'
                    },
                    {
                      key: 'statusUpdates',
                      label: 'Lead Status Updates',
                      desc: 'Alerts when any of your leads move to Qualified, Proposal Sent, or Won.',
                      badge: 'Pipeline'
                    },
                    {
                      key: 'taskReminders',
                      label: 'Task & Follow-Up Reminders',
                      desc: 'Scheduled reminders for pending follow-ups and upcoming touchpoints.',
                      badge: 'Tasks'
                    },
                    {
                      key: 'accountAlerts',
                      label: 'Important Account Notifications',
                      desc: 'Critical security events, password changes, and login activity.',
                      badge: 'Security',
                      alwaysOn: true
                    },
                    {
                      key: 'weeklyDigest',
                      label: 'Weekly Pipeline Digest',
                      desc: 'Monday morning summary of your pipeline — new leads, conversion rates, and revenue.',
                      badge: 'Digest'
                    },
                    {
                      key: 'marketingUpdates',
                      label: 'Product Updates & Announcements',
                      desc: 'Occasional emails about new features, improvements, and CRM tips.',
                      badge: 'Product'
                    }
                  ].map(({ key, label, desc, badge, alwaysOn }) => (
                    <div key={key} className="py-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
                          {badge && (
                            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                              {badge}
                            </span>
                          )}
                          {alwaysOn && (
                            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 px-1.5 py-0.5 rounded-md">
                              Always on
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                      <div className="flex-shrink-0 mt-0.5">
                        <ToggleSwitch
                          enabled={alwaysOn ? true : notifications[key]}
                          onToggle={() => !alwaysOn && setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                          label={label}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 mt-2 border-t border-gray-100 dark:border-gray-700/60">
                  <p className="text-xs text-gray-400 dark:text-gray-600">
                    Changes take effect immediately after saving.
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveNotifications}
                    disabled={isSavingNotifs}
                    className={primaryBtnClass}
                  >
                    <Save size={15} />
                    {isSavingNotifs ? 'Saving…' : 'Save Preferences'}
                  </button>
                </div>
              </SectionCard>
            )}

            {/* ══ SECTION: CRM PREFERENCES ═══════════════════════════ */}
            {activeTab === 'crm' && (
              <SectionCard
                title="CRM Preferences"
                subtitle="Customize default behaviors, date formats, and timezone for your workflow."
                icon={SettingsIcon}
              >
                <AlertBanner type={crmMsg.type} message={crmMsg.text} onDismiss={() => setCrmMsg({ type: '', text: '' })} />

                <div className="mt-4 space-y-6">
                  {/* Default Lead Status */}
                  <div>
                    <label className={labelClass}>
                      <Tag size={12} className="inline mr-1.5" />
                      Default Lead Status
                    </label>
                    <select
                      value={crmPrefs.defaultLeadStatus}
                      onChange={(e) => setCrmPrefs(prev => ({ ...prev, defaultLeadStatus: e.target.value }))}
                      className={selectClass}
                    >
                      {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1.5">
                      New leads will be created with this status by default.
                    </p>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className={labelClass}>
                      <Calendar size={12} className="inline mr-1.5" />
                      Date Format
                    </label>
                    <select
                      value={crmPrefs.dateFormat}
                      onChange={(e) => setCrmPrefs(prev => ({ ...prev, dateFormat: e.target.value }))}
                      className={selectClass}
                    >
                      {[
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY  (11/12/2026)' },
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY  (12/11/2026)' },
                        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD  (2026-11-12)' },
                        { value: 'DD MMM YYYY', label: 'DD MMM YYYY  (12 Nov 2026)' },
                        { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY  (Nov 12, 2026)' }
                      ].map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1.5">
                      Controls how dates are displayed in lead tables and reports.
                    </p>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className={labelClass}>
                      <Clock size={12} className="inline mr-1.5" />
                      Timezone
                    </label>
                    <select
                      value={crmPrefs.timezone}
                      onChange={(e) => setCrmPrefs(prev => ({ ...prev, timezone: e.target.value }))}
                      className={selectClass}
                    >
                      {[
                        { value: 'UTC', label: 'UTC — Coordinated Universal Time' },
                        { value: 'America/New_York', label: 'UTC-5/4 — Eastern Time (ET)' },
                        { value: 'America/Chicago', label: 'UTC-6/5 — Central Time (CT)' },
                        { value: 'America/Denver', label: 'UTC-7/6 — Mountain Time (MT)' },
                        { value: 'America/Los_Angeles', label: 'UTC-8/7 — Pacific Time (PT)' },
                        { value: 'Europe/London', label: 'UTC+0/1 — Greenwich / BST' },
                        { value: 'Europe/Paris', label: 'UTC+1/2 — Central European Time' },
                        { value: 'Europe/Berlin', label: 'UTC+1/2 — Germany / Berlin' },
                        { value: 'Asia/Kolkata', label: 'UTC+5:30 — India Standard Time' },
                        { value: 'Asia/Dubai', label: 'UTC+4 — Gulf Standard Time' },
                        { value: 'Asia/Singapore', label: 'UTC+8 — Singapore Time' },
                        { value: 'Asia/Tokyo', label: 'UTC+9 — Japan Standard Time' },
                        { value: 'Australia/Sydney', label: 'UTC+10/11 — Australian Eastern Time' }
                      ].map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1.5">
                      Used for scheduling, reminders, and timestamp display.
                    </p>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/60 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Preview</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span>
                      <span className="text-gray-400 dark:text-gray-600 text-xs">Default Status: </span>
                      <span className="font-semibold text-orange-500">{crmPrefs.defaultLeadStatus}</span>
                    </span>
                    <span>
                      <span className="text-gray-400 dark:text-gray-600 text-xs">Date: </span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {crmPrefs.dateFormat}
                      </span>
                    </span>
                    <span>
                      <span className="text-gray-400 dark:text-gray-600 text-xs">Timezone: </span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{crmPrefs.timezone}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 mt-2 border-t border-gray-100 dark:border-gray-700/60">
                  <button
                    type="button"
                    onClick={() => setCrmPrefs(defaultCrm)}
                    className={secondaryBtnClass}
                  >
                    <RotateCcw size={14} /> Reset to Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCrmPrefs}
                    disabled={isSavingCrm}
                    className={primaryBtnClass}
                  >
                    <Save size={15} />
                    {isSavingCrm ? 'Saving…' : 'Save CRM Preferences'}
                  </button>
                </div>
              </SectionCard>
            )}

            {/* ══ SECTION: PRIVACY & DATA ════════════════════════════ */}
            {activeTab === 'privacy' && (
              <div className="space-y-5">
                {/* Data Overview */}
                <SectionCard
                  title="Your Data"
                  subtitle="Information about what data Startup CRM Lite stores for your account."
                  icon={Globe}
                >
                  <div className="space-y-3 mt-1">
                    {[
                      {
                        icon: User,
                        label: 'Profile Data',
                        value: 'Name, email, role, and account preferences stored in MongoDB Atlas.'
                      },
                      {
                        icon: Tag,
                        label: 'Lead Records',
                        value: 'All leads, contacts, pipeline stages, and notes created by you.'
                      },
                      {
                        icon: Bell,
                        label: 'Notification Preferences',
                        value: 'Your alert settings — stored securely as part of your user document.'
                      },
                      {
                        icon: Lock,
                        label: 'Security Data',
                        value: 'Only your bcrypt-hashed password is stored. Plain passwords are never persisted.'
                      }
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/60">
                        <Icon size={15} className="text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden">
                  <div className="px-6 md:px-8 py-4 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/30 flex items-center gap-3">
                    <AlertTriangle size={18} className="text-red-500" />
                    <h3 className="text-sm font-bold text-red-800 dark:text-red-300 uppercase tracking-wide">
                      Danger Zone
                    </h3>
                  </div>
                  <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Trash2 size={15} className="text-red-500" />
                        Delete My Account
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm leading-relaxed">
                        Permanently removes your account and <strong>all associated leads and data</strong> from our servers. This action is irreversible.
                      </p>
                      <p className="text-[11px] text-red-500 dark:text-red-400 mt-1.5 font-medium">
                        ⚠ You will be asked to confirm your password before deletion proceeds.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 size={15} />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ SECTION: ABOUT ═════════════════════════════════════ */}
            {activeTab === 'about' && (
              <div className="space-y-5">
                {/* App Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  {/* Orange gradient hero */}
                  <div className="px-8 py-10 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                      style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                    />
                    <div className="relative flex items-center gap-5">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                        <span className="text-white font-black text-2xl">SC</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Startup CRM Lite</h2>
                        <p className="text-orange-100 text-sm mt-1">Professional Lead Management Platform</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 md:px-8 py-6 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Version', value: '1.0.0' },
                        { label: 'Stack', value: 'MERN' },
                        { label: 'Database', value: 'MongoDB' },
                        { label: 'License', value: 'MIT' }
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/60">
                          <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider">{label}</div>
                          <div className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">{value}</div>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Startup CRM Lite is a full-stack MERN CRM application built for teams that need a lightweight but powerful way to manage leads, track pipeline progress, and close more deals — without enterprise complexity.
                    </p>
                  </div>
                </div>

                {/* Support */}
                <SectionCard title="Help & Support" subtitle="Resources and contact options." icon={HelpCircle}>
                  <div className="space-y-3 mt-1">
                    {[
                      {
                        icon: ExternalLink,
                        label: 'Documentation',
                        desc: 'Read the full user guide and feature documentation.',
                        action: 'View Docs',
                        href: '#'
                      },
                      {
                        icon: Mail,
                        label: 'Email Support',
                        desc: 'Contact our support team at support@startupcrm.io',
                        action: 'Send Email',
                        href: 'mailto:support@startupcrm.io'
                      },
                      {
                        icon: Globe,
                        label: 'Community Forum',
                        desc: 'Ask questions and share tips with other CRM users.',
                        action: 'Join Forum',
                        href: '#'
                      }
                    ].map(({ icon: Icon, label, desc, action, href }) => (
                      <div key={label} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/60 hover:border-orange-200 dark:hover:border-orange-800/40 transition-colors">
                        <div className="flex items-start gap-3">
                          <Icon size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                          </div>
                        </div>
                        <a
                          href={href}
                          className="flex-shrink-0 text-xs font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 flex items-center gap-1 transition-colors"
                        >
                          {action} <ChevronRight size={13} />
                        </a>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                {/* Build info footer */}
                <div className="text-center text-xs text-gray-400 dark:text-gray-600 space-y-1">
                  <p>Startup CRM Lite v1.0.0 · Built with React 19, Node.js, Express, MongoDB Atlas</p>
                  <p>© {new Date().getFullYear()} Startup CRM Lite. All rights reserved.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Settings;
