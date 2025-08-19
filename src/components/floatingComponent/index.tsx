"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingFormProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export function FloatingComponent({
  isOpen,
  onClose,
  title,
  children 
}: FloatingFormProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-[90%] max-w-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white text-center flex-1">
                {title || "Nueva Transacción"}
              </h2>
              <button
                className="text-white hover:text-red-400 transition-colors"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
