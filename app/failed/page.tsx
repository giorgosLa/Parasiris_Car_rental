"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

export default function FailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-lg text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb  -4"
        >
          <XCircle size={80} className="text-red-500" />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Payment Failed
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mt-3 leading-relaxed">
          Unfortunately, your payment did not go through. This may happen if
          your card was declined or if the session expired.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow"
          >
            Try Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
          >
            Go Back Home
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          If you believe this is a mistake, please contact our support.
        </p>
      </motion.div>
    </div>
  );
}
