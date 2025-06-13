import React, { FC } from "react";

interface GlitchTextProps {
  children: React.ReactNode;
  speed?: number;
  enableShadows?: boolean;
  className?: string;
}

const GlitchText: FC<GlitchTextProps> = ({
  children,
  speed = 0.5,
  enableShadows = true,
  className = "",
}) => {
  const shadowBefore = enableShadows ? "text-cyan-400" : "";
  const shadowAfter = enableShadows ? "text-purple-500" : "";

  const style = {
    "--glitch-after-duration": `${speed * 3}s`,
    "--glitch-before-duration": `${speed * 2}s`,
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        @keyframes glitch {
          0%   { clip-path: inset(20% 0 50% 0); }
          5%   { clip-path: inset(10% 0 60% 0); }
          10%  { clip-path: inset(15% 0 55% 0); }
          15%  { clip-path: inset(25% 0 35% 0); }
          20%  { clip-path: inset(30% 0 40% 0); }
          25%  { clip-path: inset(40% 0 20% 0); }
          30%  { clip-path: inset(10% 0 60% 0); }
          35%  { clip-path: inset(15% 0 55% 0); }
          40%  { clip-path: inset(25% 0 35% 0); }
          45%  { clip-path: inset(30% 0 40% 0); }
          50%  { clip-path: inset(20% 0 50% 0); }
          55%  { clip-path: inset(10% 0 60% 0); }
          60%  { clip-path: inset(15% 0 55% 0); }
          65%  { clip-path: inset(25% 0 35% 0); }
          70%  { clip-path: inset(30% 0 40% 0); }
          75%  { clip-path: inset(40% 0 20% 0); }
          80%  { clip-path: inset(20% 0 50% 0); }
          85%  { clip-path: inset(10% 0 60% 0); }
          90%  { clip-path: inset(15% 0 55% 0); }
          95%  { clip-path: inset(25% 0 35% 0); }
          100% { clip-path: inset(30% 0 40% 0); }
        }

        .glitch-before {
          animation: glitch var(--glitch-before-duration, 1.5s) infinite linear alternate-reverse;
          text-shadow: 5px 0 cyan;
          background-color: #02040b;
          clip-path: inset(0 0 0 0);
          position: absolute;
          top: 0;
          left: -10px;
          opacity: 0.8;
          pointer-events: none;
        }

        .glitch-after {
          animation: glitch var(--glitch-after-duration, 2s) infinite linear alternate-reverse;
          text-shadow: -5px 0 purple;
          background-color: #02040b;
          clip-path: inset(0 0 0 0);
          position: absolute;
          top: 0;
          left: 10px;
          opacity: 0.8;
          pointer-events: none;
        }
      `}</style>

      <div
        style={style}
        className={`relative inline-block font-black text-[clamp(2rem,10vw,8rem)] select-none cursor-pointer text-white ${className}`}
        aria-label={children}
      >
        {children}

        <span
          aria-hidden="true"
          className={`absolute top-0 left-[-10px] ${shadowBefore} glitch-before`}
        >
          {children}
        </span>

        <span
          aria-hidden="true"
          className={`absolute top-0 left-[10px] ${shadowAfter} glitch-after`}
        >
          {children}
        </span>
      </div>
    </>
  );
};

export default GlitchText;
