"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

// 1. The Vault: Lives OUTSIDE the component so it survives remounts
const memoryVault: Record<string, number> = {};

// Function to reset memory vault (call when starting scenarios)
export function resetAnimatedCounterMemory() {
  Object.keys(memoryVault).forEach(key => delete memoryVault[key]);
}

interface AnimatedCounterProps {
  value: number;
  id: string;
  prefix?: string;
  suffix?: string;
  stiffness?: number;
  damping?: number;
  resetOnMount?: boolean;
}

export function AnimatedCounter({ value, id, prefix = "", suffix = "", stiffness = 90, damping = 40, resetOnMount = false }: AnimatedCounterProps) {
  // 2. Initialize using the vault's memory for this specific ID.
  // If resetOnMount is true, always start from 0, otherwise use vault or value
  const startValue = resetOnMount ? 0 : (memoryVault[id] !== undefined ? memoryVault[id] : value);
  const motionValue = useMotionValue(startValue);
  
  // Reset vault when resetOnMount is true
  useEffect(() => {
    if (resetOnMount) {
      memoryVault[id] = 0;
    }
  }, [resetOnMount, id]);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
    mass: 1
  });

  const displayValue = useTransform(springValue, (latest) => {
    return `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    // If resetOnMount, the motionValue is already initialized to 0, so just animate to value
    // Otherwise, animate from current vault value to new value
    motionValue.set(value);
    // Save the new value to the vault so the next scene remembers it
    memoryVault[id] = value;
  }, [value, motionValue, id, resetOnMount]);

  return <motion.span>{displayValue}</motion.span>;
}
