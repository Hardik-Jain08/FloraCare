import { ReactNode } from "react";
import { createPortal } from "react-dom";

export const renderInPortal = (child: ReactNode, portalId?: string) => {
  const destinationPortal = document.getElementById(portalId ?? "globalPortal");
  return (
    <>
      {child && destinationPortal
        ? createPortal(child, destinationPortal)
        : child}
    </>
  );
};
