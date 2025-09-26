import { useRef, useEffect, useState } from "react";

export default function ScrollContainer({ children }) {
  const ref = useRef(null);
  const [shadows, setShadows] = useState({ left: false, right: false });

  const checkShadows = () => {
    const el = ref.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setShadows({
      left: scrollLeft > 0,
      right: scrollLeft + clientWidth <= scrollWidth,
    });
  };

  useEffect(() => {
    const el = ref.current;
    checkShadows();
    el.addEventListener("scroll", checkShadows);
    window.addEventListener("resize", checkShadows);

    return () => {
      el.removeEventListener("scroll", checkShadows);
      window.removeEventListener("resize", checkShadows);
    };
  }, []);

  return (
    <div
      ref={ref}
       className={`extractedText
        ${!children && "nowExtractInfo"} 
        ${shadows.left ? "has-left-shadow" : ""} 
        ${shadows.right ? "has-right-shadow" : ""}`}
    >
      {children}
    </div>
  );
}
