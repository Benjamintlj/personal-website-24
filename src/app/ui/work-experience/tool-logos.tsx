"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tool {
    name: string;
    icon: React.ReactNode;
}

function Tooltip({
    tooltipKey,
    name,
    anchorRect,
}: {
    tooltipKey: number;
    name: string;
    anchorRect: DOMRect;
}) {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [left, setLeft] = useState(anchorRect.left + anchorRect.width / 2);
    const top = anchorRect.top - 12;

    useLayoutEffect(() => {
        const width = tooltipRef.current?.offsetWidth ?? 0;
        const center = anchorRect.left + anchorRect.width / 2;
        const padding = 12;
        const min = padding + width / 2;
        const max = window.innerWidth - padding - width / 2;

        setLeft(Math.min(max, Math.max(min, center)));
    }, [anchorRect, name, tooltipKey]);

    return (
        <motion.div
            className="fixed z-50 pointer-events-none"
            style={{ left, top }}
            initial={false}
            animate={{ left, top }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
            <div style={{ transform: "translate(-50%, -100%)" }}>
                <motion.div
                    key={tooltipKey}
                    ref={tooltipRef}
                    className="relative max-w-[calc(100vw-24px)] bg-neutral-900 border border-neutral-700 text-white text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg"
                    initial={{ opacity: 0, y: 6, rotate: -8, scale: 0.82 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 24,
                    }}
                >
                    {name}
                    {/* Arrow */}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-neutral-700" />
                    <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-neutral-900 mt-[-1px]" />
                </motion.div>
            </div>
        </motion.div>
    );
}

export function ToolLogos({ tools }: { tools: Tool[] }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [tooltip, setTooltip] = useState<{
        key: number;
        name: string;
        anchorRect: DOMRect;
    } | null>(null);

    return (
        <div className="mb-3 overflow-x-auto hide-scrollbar pb-1">
            <div className="flex w-max flex-row items-center px-1">
                {tools.map((tool, i) => (
                    <div
                        key={i}
                        className="relative -mr-2 last:mr-0 shrink-0 cursor-default"
                        style={{ zIndex: hovered === i ? 50 : i }}
                        onMouseEnter={(event) => {
                            setHovered(i);
                            setTooltip({
                                key: i,
                                name: tool.name,
                                anchorRect: event.currentTarget.getBoundingClientRect(),
                            });
                        }}
                        onMouseLeave={() => {
                            setHovered(null);
                            setTooltip(null);
                        }}
                    >
                        <motion.div
                            className="h-7 w-7 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-base"
                            animate={{ scale: hovered === i ? 1.15 : 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                            {tool.icon}
                        </motion.div>
                    </div>
                ))}
            </div>
            <AnimatePresence>
                {tooltip && (
                    <Tooltip
                        tooltipKey={tooltip.key}
                        name={tooltip.name}
                        anchorRect={tooltip.anchorRect}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
