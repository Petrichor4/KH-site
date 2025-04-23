import { useEffect, useState } from "react";

export default function SizeCheck() {
    
      const [size, setSize] = useState<{ width: number; height: number } | null>(
        null
      );

      useEffect(() => {
        if (typeof window !== "undefined") {
          const updateSize = () =>
            setSize({ width: window.innerWidth, height: window.innerHeight });
          updateSize(); // Set initial size immediately
          window.addEventListener("resize", updateSize);
          return () => window.removeEventListener("resize", updateSize);
        }
      }, []);
    
      return { size }
}