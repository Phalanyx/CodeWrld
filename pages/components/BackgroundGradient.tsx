import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
  color,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  color?: "green" | "red" | "blue" | "purple" |"gray" | "other";
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  const getGradient = (color: string) => {
    switch (color) {
      case "green":
        return "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ff00,transparent),radial-gradient(circle_farthest-side_at_100%_0,#00cc00,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#009900,transparent),radial-gradient(circle_farthest-side_at_0_0,#006600,#003300)]";
      case "red":
        return "bg-[radial-gradient(circle_farthest-side_at_0_100%,#ff0000,transparent),radial-gradient(circle_farthest-side_at_100%_0,#cc0000,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#990000,transparent),radial-gradient(circle_farthest-side_at_0_0,#660000,#330000)]";
      case "blue":
        return "bg-[radial-gradient(circle_farthest-side_at_0_100%,#3399ff,transparent),radial-gradient(circle_farthest-side_at_100%_0,#3366ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#3333ff,transparent),radial-gradient(circle_farthest-side_at_0_0,#0000ff,#0000cc)]";
      case "purple":
        return "bg-[radial-gradient(circle_farthest-side_at_0_100%,#ff00ff,transparent),radial-gradient(circle_farthest-side_at_100%_0,#cc00cc,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#990099,transparent),radial-gradient(circle_farthest-side_at_0_0,#660066,#330033)]";
      case "gray":
        return "bg-[radial-gradient(circle_farthest-side_at_0_100%,rgba(255,255,255,0.2),transparent),radial-gradient(circle_farthest-side_at_100%_0,rgba(200,200,200,0.2),transparent),radial-gradient(circle_farthest-side_at_100%_100%,rgba(150,150,150,0.2),transparent),radial-gradient(circle_farthest-side_at_0_0,rgba(100,100,100,0.2),rgba(50,50,50,0.2))]";
      default:
        return "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]";
    }
  };

  const gradientClass = getGradient(color || "other");

  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-xl z-[1] opacity-40 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          gradientClass
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-2xl z-[1] will-change-transform",
          gradientClass
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

export default BackgroundGradient;