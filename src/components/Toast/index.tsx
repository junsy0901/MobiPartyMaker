interface ToastProps {
  message: string;
  type: "error" | "success";
}

export function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-xl animate-slide-in ${
        type === "error"
          ? "bg-red-500/90 text-white"
          : "bg-emerald-500/90 text-white"
      }`}
    >
      {message}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

