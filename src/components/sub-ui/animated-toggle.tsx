"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnimToggle() {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => setIsToggled(!isToggled);

  return (
    <>
      <div className="flex items-center justify-center w-full  z-50">
        <div className="relative p-4 rounded-full bg-background border text-muted-foreground w-full h-18 flex items-center overflow-hidden">
          {/* Slider Track */}
          <div className="relative w-full h-12">
            {/* Actual Button with animated X */}
            <motion.div
              initial={false}
              animate={{ x: isToggled ? "400%" : "0%" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 18,
              }}
              className="absolute top-0 left-0 "
            >
              <Button
                size="icon"
                variant="outline"
                className="size-12 rounded-full shadow bg-transparent"
                onClick={handleToggle}
              />
            </motion.div>
          </div>

          {/* Lock Icon (left) */}
          <AnimatePresence mode="wait">
            {isToggled && (
              <motion.div
                key="lock"
                className="absolute left-5 flex items-center"
                initial={{ opacity: 0, scale: 0.8, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Lock className="size-5" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unlock Icon (right) */}
          <AnimatePresence mode="wait">
            {!isToggled && (
              <motion.div
                key="unlock"
                className="absolute right-5 flex items-center"
                initial={{ opacity: 0, scale: 0.8, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 8 }}
                transition={{ duration: 0.3 }}
              >
                <Unlock className="size-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div
        className={cn(
          "top-0 right-0 h-full w-full bg-transparent z-40",
          isToggled ? "fixed" : "hidden"
        )}
      />
    </>
  );
}
