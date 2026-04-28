import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, User, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG } from '../api/config';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_CONFIG.AUTH_SERVICE}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data.message);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">User Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user?.username}!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            Service Status
          </h2>
          
          {isLoading ? (
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying authorization...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                {message}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Your connection to the authentication service is secure.
              </p>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <User className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{user?.username}</h3>
            <p className="text-sm text-slate-500 mb-6">Verified Customer</p>
            <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Account Type</span>
                <span className="font-bold text-primary-600">Standard</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Member Since</span>
                <span className="text-slate-900 dark:text-slate-100 font-medium">Apr 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
