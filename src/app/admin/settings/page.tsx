import React from "react";
import { User, Bell, Lock, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-navy-custom">Academy Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your academy preferences, security, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-emerald-50 text-emerald-custom rounded-xl font-bold text-sm transition-colors text-left">
            <Globe className="w-4 h-4" />
            <span>General</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-navy-custom rounded-xl font-semibold text-sm transition-colors text-left">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-navy-custom rounded-xl font-semibold text-sm transition-colors text-left">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-navy-custom rounded-xl font-semibold text-sm transition-colors text-left">
            <Lock className="w-4 h-4" />
            <span>Security</span>
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-custom mb-4">General Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Academy Name</label>
                  <input 
                    type="text" 
                    defaultValue="Al Hannan Quran Institute" 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom outline-none text-sm font-semibold text-navy-custom transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Email</label>
                  <input 
                    type="email" 
                    defaultValue="info@alhannanquraninstitute.com" 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom outline-none text-sm font-semibold text-navy-custom transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Default Timezone</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom outline-none text-sm font-semibold text-navy-custom transition-all">
                  <option value="Asia/Karachi">Pakistan Standard Time (PKT)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="America/New_York">Eastern Standard Time (EST)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <button type="button" className="px-6 py-2.5 bg-emerald-custom hover:bg-emerald-900 text-white font-bold text-sm rounded-xl transition-all shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-custom mb-4">Website Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-navy-custom">Maintenance Mode</h3>
                  <p className="text-xs text-gray-500 font-medium">Temporarily disable public access to the website.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div>
                  <h3 className="text-sm font-bold text-navy-custom">Allow Public Registrations</h3>
                  <p className="text-xs text-gray-500 font-medium">Let students register themselves from the homepage.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-emerald-custom cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
