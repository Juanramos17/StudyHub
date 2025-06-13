import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <>
      <style>{`
        @keyframes shine {
          0% {
            background-position: 100%;
          }
          100% {
            background-position: -100%;
          }
        }
        .shine-animation {
          animation-name: shine;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: ${animationDuration};
          background-size: 200% 100%;
          background-image: linear-gradient(
            120deg,
            rgba(222, 242, 91, 0) 40%,
            rgba(238, 219, 97, 0.8) 50%,
            rgba(255, 255, 255, 0) 60%
          );
          -webkit-background-clip: text;
          background-clip: text;
          display: inline-block;
        }
        .text-base-style {
          color: rgba(255, 0, 0, 0.64);
          -webkit-background-clip: text;
          background-clip: text;
          display: inline-block;
        }
      `}</style>

      <div
        className={`${disabled ? "text-primary/60" : "shine-animation"} ${className}`}
        style={{}}
      >
        {text}
      </div>
    </>
  );
};

export default ShinyText;
