"use client";

import { useState } from "react";

export default function SecuritySettings() {
  const [twoFA, setTwoFA] = useState(true);
  const [timeout, setTimeoutValue] = useState("30");
  const [attempts, setAttempts] = useState("5");
  const [ipList, setIpList] = useState("192.168.1.1\n10.0.0.1");

  return (
    <div className="shadow-sm rounded-xl p-6 bg-white">
      <h2 className="text-[20px] font-semibold mb-4">Security Configuration</h2>

      {/* 2FA Toggle */}
      <div className="flex justify-between items-center p-4 mb-4 rounded-lg bg-green-200">
        <div>
          <h3 className="text-[16px] font-medium">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600">Required for all admin logins</p>
        </div>

        <button
          onClick={() => setTwoFA(!twoFA)}
          className={`w-[42px] h-[22px] flex items-center px-1 rounded-full ${
            twoFA ? "bg-purple-600 justify-end" : "bg-gray-300"
          }`}
        >
          <div className="w-[16px] h-[16px] bg-white rounded-full" />
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {/* Session Timeout */}
        <div>
          <label className="text-sm text-gray-600">
            Session Timeout (minutes)
          </label>
          <input
            value={timeout}
            onChange={(e) => setTimeoutValue(e.target.value)}
            className="w-full border rounded-md h-[40px] px-3 mt-1"
          />
        </div>

        {/* Login Attempts */}
        <div>
          <label className="text-sm text-gray-600">
            Maximum Login Attempts
          </label>
          <input
            value={attempts}
            onChange={(e) => setAttempts(e.target.value)}
            className="w-full border rounded-md h-[40px] px-3 mt-1"
          />
        </div>

        {/* IP Whitelist */}
        <div>
          <label className="text-sm text-gray-600">
            IP Whitelist (one per line)
          </label>
          <textarea
            value={ipList}
            onChange={(e) => setIpList(e.target.value)}
            rows={3}
            className="w-full border rounded-md p-3 mt-1"
          />
        </div>
      </div>

      {/* Best Practices */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF]">
        <h3 className="text-purple-700 font-medium mb-2">
          Security Best Practices
        </h3>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li>Enable Two-Factor Authentication for all admin accounts</li>
          <li>Use strong passwords with minimum 12 characters</li>
          <li>Regularly review access logs and user permissions</li>
          <li>Rotate API keys and secrets periodically</li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button className="bg-purple-600 text-white px-6 py-2 rounded-md">
          Save Security Settings
        </button>
      </div>
    </div>
  );
}
