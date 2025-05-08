import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface UserSettings {
  email: string;
  name: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    browser: boolean;
    scanComplete: boolean;
    newIssues: boolean;
  };
  scanPreferences: {
    autoScan: boolean;
    scanInterval: 'daily' | 'weekly' | 'monthly';
    maxConcurrentScans: number;
  };
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    email: user?.email || '',
    name: user?.name || '',
    theme: 'system',
    notifications: {
      email: true,
      browser: true,
      scanComplete: true,
      newIssues: true,
    },
    scanPreferences: {
      autoScan: false,
      scanInterval: 'weekly',
      maxConcurrentScans: 3,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement settings update
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <section className="card">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Theme Settings */}
        <section className="card">
          <h2 className="text-xl font-semibold mb-4">Theme</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Theme Preference</label>
              <select
                className="form-select"
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as UserSettings['theme'] })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="card">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="form-label">Email Notifications</label>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: e.target.checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="form-label">Browser Notifications</label>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={settings.notifications.browser}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, browser: e.target.checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="form-label">Scan Complete Notifications</label>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={settings.notifications.scanComplete}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, scanComplete: e.target.checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="form-label">New Issues Notifications</label>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={settings.notifications.newIssues}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, newIssues: e.target.checked }
                })}
              />
            </div>
          </div>
        </section>

        {/* Scan Preferences */}
        <section className="card">
          <h2 className="text-xl font-semibold mb-4">Scan Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="form-label">Automatic Scanning</label>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={settings.scanPreferences.autoScan}
                onChange={(e) => setSettings({
                  ...settings,
                  scanPreferences: { ...settings.scanPreferences, autoScan: e.target.checked }
                })}
              />
            </div>
            <div>
              <label className="form-label">Scan Interval</label>
              <select
                className="form-select"
                value={settings.scanPreferences.scanInterval}
                onChange={(e) => setSettings({
                  ...settings,
                  scanPreferences: {
                    ...settings.scanPreferences,
                    scanInterval: e.target.value as UserSettings['scanPreferences']['scanInterval']
                  }
                })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="form-label">Maximum Concurrent Scans</label>
              <input
                type="number"
                className="form-input"
                min="1"
                max="10"
                value={settings.scanPreferences.maxConcurrentScans}
                onChange={(e) => setSettings({
                  ...settings,
                  scanPreferences: {
                    ...settings.scanPreferences,
                    maxConcurrentScans: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 