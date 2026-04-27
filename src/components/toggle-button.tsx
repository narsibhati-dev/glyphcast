"use client";

import React from "react";
import { motion } from "framer-motion";

const ToggleButton = ({
  toggle = false,
  setToggle = () => {},
}: {
  toggle: boolean;
  setToggle: (value: boolean) => void;
}) => {
  return (
    <motion.div
      onClick={() => setToggle(!toggle)}
      className="rounded-full w-12 h-6 flex items-center px-[3px] cursor-pointer shrink-0"
      style={{
        background: toggle ? "#B54B00" : "rgba(0, 0, 0, 0.12)",
        boxShadow:
          "0px 1px 0px rgba(255, 255, 255, 0.25), inset 0px 1px 2px rgba(0, 0, 0, 0.15)",
      }}
    >
      <motion.div
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        animate={{ x: toggle ? "22px" : "0px" }}
        className="h-[18px] w-[18px] border rounded-full bg-[#F4F4F4]"
        style={{
          boxShadow:
            "0.4px 0.4px 0.6px -0.75px rgba(0,0,0,0.26), 1.2px 1.2px 1.7px -1.5px rgba(0,0,0,0.247), 2.6px 2.6px 3.8px -2.25px rgba(0,0,0,0.23), inset 1px 1px 1px #FFFFFF, inset -1px -1px 0px rgba(0,0,0,0.1)",
        }}
      />
    </motion.div>
  );
};

export default ToggleButton;
