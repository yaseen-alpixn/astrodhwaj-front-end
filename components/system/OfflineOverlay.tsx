"use client";

type OfflineOverlayProps = {
  isOnline: boolean;
};

export default function OfflineOverlay({ isOnline }: OfflineOverlayProps) {
  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 px-4">
      <div className="w-full max-w-[360px] rounded-2xl bg-white px-6 py-5 text-center shadow-2xl">
        <h2 className="text-[20px] font-semibold text-[#171717]">No Internet Connection</h2>
        <p className="mt-2 text-sm text-gray-500">Trying to reconnect...</p>
      </div>
    </div>
  );
}
