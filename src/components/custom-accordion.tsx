"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

interface CustomAccordionProps {
  items: { title: string; content: React.ReactNode }[];
}

export const CustomAccordion: React.FC<CustomAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      {items.map((item, idx) => (
        <div key={item.title} className="mb-3 last:mb-0">
          <AccordionItem
            title={item.title}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            {item.content}
          </AccordionItem>
        </div>
      ))}
    </div>
  );
};

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  isOpen,
  onClick,
  children,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const selectedFaqStyle: React.CSSProperties = {
    background: isDark
      ? "radial-gradient(152.32% 683.53% at 108.86% 152.32%, #1C1C20 0%, #151518 100%)"
      : "radial-gradient(152.32% 683.53% at 108.86% 152.32%, #FFD9B8 0%, #FFF5ED 100%)",
    boxShadow: isDark
      ? "0px 4px 1px rgba(0,0,0,0.08), 0px 2px 1px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.26), 0px 0px 1px rgba(0,0,0,0.3), inset 0px 2px 2.2px rgba(255,255,255,0.04)"
      : "0px 4px 1px rgba(0, 0, 0, 0.01), 0px 2px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.09), 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 2px 2.2px #FFFFFF",
    borderRadius: "16px",
    border: isDark ? "1px solid #2A2A31" : undefined,
    position: "relative",
    zIndex: 1,
  };

  const defaultFaqStyle: React.CSSProperties = {
    background: isDark ? "#151518" : "#FFFFFF",
    boxShadow: isDark
      ? "0px 4px 1px rgba(0,0,0,0.04), 0px 2px 1px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.18), 0px 0px 1px rgba(0,0,0,0.2), inset 0px 2px 2.2px rgba(255,255,255,0.04)"
      : "0px 4px 1px rgba(0, 0, 0, 0.01), 0px 2px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.09), 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 2px 2.2px #FFFFFF",
    borderRadius: "16px",
    border: isDark ? "1px solid #2A2A31" : undefined,
  };

  return (
    <div
      className=" relative overflow-hidden px-5 py-1 transition-all duration-200 ease-out"
      style={isOpen ? selectedFaqStyle : defaultFaqStyle}
    >
      {isOpen && (
        <div
          className="pointer-events-none absolute inset-0 texture-crosshair transition-opacity duration-250 ease-out"
          aria-hidden="true"
          style={{
            borderRadius: "24px",
            opacity: 0.2,
            zIndex: 0,
          }}
        />
      )}
      <button
        className="w-full flex justify-between items-center py-4 text-sm font-medium text-left transition-colors relative z-10 cursor-pointer"
        style={{ color: isOpen ? (isDark ? "#F5F5F7" : "#111111") : undefined }}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="relative w-6 h-6 flex items-center justify-center">
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <path
              d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
              fill={isDark ? "#3f3f46" : "#F5F5F5"}
            />
            <motion.path
              d="M16.0833 11.416C16.4054 11.416 16.6666 11.6772 16.6666 11.9993C16.6666 12.3215 16.4054 12.5827 16.0833 12.5827H7.91659C7.59442 12.5827 7.33325 12.3215 7.33325 11.9993C7.33325 11.6772 7.59442 11.416 7.91659 11.416H16.0833Z"
              initial={false}
              animate={{
                fill: isOpen ? "#B54B00" : isDark ? "#e4e4e7" : "#000000",
              }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            />
            <motion.path
              d="M11.4167 16.084V7.91732C11.4167 7.59515 11.6779 7.33398 12.0001 7.33398C12.3222 7.33398 12.5834 7.59515 12.5834 7.91732V16.084C12.5834 16.4062 12.3222 16.6673 12.0001 16.6673C11.6779 16.6673 11.4167 16.4062 11.4167 16.084Z"
              initial={false}
              animate={{
                opacity: isOpen ? 0 : 1,
                fill: isOpen ? "#B54B00" : isDark ? "#e4e4e7" : "#000000",
              }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            />
          </motion.svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 overflow-hidden"
          >
            <div
              className="pb-4 pt-0 text-sm"
              style={{ color: isDark ? "#B8B8C2" : "#333333" }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
