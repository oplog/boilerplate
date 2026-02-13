// Navigation Progress Bar
// Route değişikliklerinde ve API yüklemelerinde üst kısımda ince yükleme çubuğu gösterir
// useLocation (route) + useIsFetching (TanStack Query) ile çift sinyal algılar

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useIsFetching } from "@tanstack/react-query";

export function NavigationProgress() {
  const location = useLocation();
  const isFetching = useIsFetching();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Route değişikliğinde animasyon başlat
  useEffect(() => {
    setVisible(true);
    setProgress(30);

    timerRef.current = setTimeout(() => setProgress(70), 100);
    const t2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
    }, 300);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(t2);
    };
  }, [location.pathname]);

  // API yüklemesi varsa çubuk görünür kalsın
  useEffect(() => {
    if (isFetching > 0) {
      setVisible(true);
      setProgress(60);
    } else if (progress > 0) {
      setProgress(100);
      const t = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isFetching]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-0.5 bg-primary transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
