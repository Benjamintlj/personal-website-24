"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tool {
    name: string;
    icon: React.ReactNode;
}

function Tooltip({ name }: { name: string }) {
    return (
        <motion.div
            className="absolute bottom-full left-1/2 mb-3 z-50 pointer-events-none"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, y: 6, rotate: -8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, rotate: 8, scale: 0.8 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 22,
            }}
        >
            <div className="relative bg-neutral-900 border border-neutral-700 text-white text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
                {name}
                {/* Arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-neutral-700" />
                <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-neutral-900 mt-[-1px]" />
            </div>
        </motion.div>
    );
}

export function ToolLogos({ tools }: { tools: Tool[] }) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="flex flex-row items-center mb-3">
            {tools.map((tool, i) => (
                <div
                    key={i}
                    className="relative -mr-2 cursor-default"
                    style={{ zIndex: hovered === i ? 50 : i }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                >
                    <motion.div
                        className="h-7 w-7 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-base"
                        animate={{ scale: hovered === i ? 1.15 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                        {tool.icon}
                    </motion.div>
                    <AnimatePresence>
                        {hovered === i && <Tooltip name={tool.name} />}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
