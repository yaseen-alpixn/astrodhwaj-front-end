"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import { adminApi, clearAdminSession } from "../api";

type AdminProfile = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [password, setPassword] = useState({ current_password: "", new_password: "" });
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    adminApi<AdminProfile>("/auth/me")
      .then((response) => setProfile(response.data))
      .catch((err) => setMessage(err instanceof Error ? err.message : "Unable to load profile"));
  }, []);

  const saveProfile = () => {
    if (!profile) return;
    adminApi<AdminProfile>("/auth/profile", { method: "PUT", body: JSON.stringify(profile) })
      .then((response) => {
        setProfile(response.data);
        setMessage("Profile saved");
      })
      .catch((err) => setMessage(err instanceof Error ? err.message : "Save failed"));
  };

  const changePassword = () => {
    adminApi("/auth/change-password", { method: "PUT", body: JSON.stringify(password) })
      .then(() => {
        setPassword({ current_password: "", new_password: "" });
        setMessage("Password changed");
      })
      .catch((err) => setMessage(err instanceof Error ? err.message : "Password change failed"));
  };

  const uploadAvatar = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const upload = await adminApi<{ url: string }>("/upload/image", { method: "POST", body: form });
    setProfile((current) => current ? { ...current, avatar_url: upload.data.url } : current);
  };

  const logoutAll = () => {
    adminApi("/auth/logout-all", { method: "POST" })
      .then(() => {
        clearAdminSession();
        window.location.href = "/login/user";
      })
      .catch((err) => setMessage(err instanceof Error ? err.message : "Logout failed"));
  };

  return (
    <>
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-white py-8 pl-5 pr-2 md:p-6">
        <div className="mb-5">
          <h1 className="text-[28px] font-semibold tracking-tight">Admin Profile</h1>
          <p className="text-[14px] font-medium text-gray-500">Manage profile and session security</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-[70px] w-[70px] overflow-hidden rounded-full bg-gray-100">
              {profile?.avatar_url && <Image src={profile.avatar_url} width={70} height={70} alt="Admin avatar" />}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadAvatar(file).catch((err) => setMessage(err instanceof Error ? err.message : "Upload failed"));
              event.currentTarget.value = "";
            }} />
            <button onClick={() => fileRef.current?.click()} className="border px-4 py-2 rounded-[8px] border-dotted bg-gray-200 text-[14px]">Upload Profile Image</button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input value={profile?.full_name || ""} onChange={(event) => setProfile((current) => current ? { ...current, full_name: event.target.value } : current)} placeholder="Full Name" className="border rounded-[8px] p-3 text-[14px]" />
            <input value={profile?.email || ""} onChange={(event) => setProfile((current) => current ? { ...current, email: event.target.value } : current)} placeholder="Email" className="border rounded-[8px] p-3 text-[14px]" />
            <input value={profile?.phone || ""} onChange={(event) => setProfile((current) => current ? { ...current, phone: event.target.value } : current)} placeholder="Phone" className="border rounded-[8px] p-3 text-[14px]" />
          </div>
          <div className="mt-5 flex justify-end">
            <button onClick={saveProfile} className="bg-[#4898E1] text-white px-6 py-2 rounded-md">Save Profile</button>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-[20px] font-semibold mb-4">Change Password</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="password" value={password.current_password} onChange={(event) => setPassword((current) => ({ ...current, current_password: event.target.value }))} placeholder="Current Password" className="border rounded-[8px] p-3 text-[14px]" />
            <input type="password" value={password.new_password} onChange={(event) => setPassword((current) => ({ ...current, new_password: event.target.value }))} placeholder="New Password" className="border rounded-[8px] p-3 text-[14px]" />
          </div>
          <div className="mt-5 flex justify-between">
            <button onClick={logoutAll} className="border px-6 py-2 rounded-md text-red-600">Logout All Devices</button>
            <button onClick={changePassword} className="bg-[#4898E1] text-white px-6 py-2 rounded-md">Change Password</button>
          </div>
        </div>
        {message && <p className="mt-4 text-right text-sm text-gray-500">{message}</p>}
      </div>
    </>
  );
}
