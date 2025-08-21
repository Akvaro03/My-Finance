"use client";

import React, { ReactNode, useEffect } from "react";
import { usePortal } from "../PortalProvider";

type PortalComponentProps = {
  title?: string;
  children: ReactNode;
  onClose?: () => void;
};

export default function PortalComponent({
  title,
  children,
  onClose,
}: PortalComponentProps) {
  const { openPortal, closePortal } = usePortal();

  useEffect(() => {
    openPortal(
      <div className="flex flex-col gap-4">
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white text-center flex-1">
              {title}
            </h2>
          </div>
        )}
        <div>{children}</div>
      </div>,
      onClose // 👈 se guarda en el provider
    );

    return () => closePortal();
  }, [children, title]);

  return null;
}
