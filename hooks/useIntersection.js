"use client";

import { useState, useEffect } from "react";

export default function useIntersection(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

  useEffect(() => {
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
    //eslint-disable-next-line
  }, []);

  return isIntersecting;
}
