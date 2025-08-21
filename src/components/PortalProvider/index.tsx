"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type PortalContextType = {
  openPortal: (content: ReactNode, onClose?: () => void) => void;
  closePortal: () => void;
};

const PortalContext = createContext<PortalContextType | null>(null);

export const usePortal = () => {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal debe usarse dentro de PortalProvider");
  return ctx;
};

export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const [portalContent, setPortalContent] = useState<ReactNode | null>(null);
  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  const openPortal = (content: ReactNode, onClose?: () => void) => {
    setPortalContent(content);
    setOnCloseCallback(() => onClose || null);
  };

  const closePortal = useCallback(() => {
    setPortalContent(null);
    if (onCloseCallback) onCloseCallback();
    setOnCloseCallback(null);
  }, [onCloseCallback]);

  // 🚫 Bloquear scroll cuando haya modal abierto
  useEffect(() => {
    if (portalContent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [portalContent]);

  // ⌨️ Cerrar con Esc
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePortal();
    };
    if (portalContent) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [portalContent, closePortal]);

  // ✅ Habilitar solo en cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PortalContext.Provider value={{ openPortal, closePortal }}>
      {children}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {portalContent && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePortal} // 👈 ahora también dispara onClose del padre
              >
                <motion.div
                  className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-6 relative w-[90%] max-w-lg"
                  initial={{ scale: 0.9, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 50 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {portalContent}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </PortalContext.Provider>
  );
};
