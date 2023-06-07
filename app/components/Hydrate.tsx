"use client";

import { useThemeStore } from "@/store";
import { ReactNode, useEffect, useState } from "react";

export default function Hydrate({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const themeStore = useThemeStore();

  // Wait till NextJs rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return (
    <>
      {isHydrated ? (
        <>
          {" "}
          <body
            className="px-4 transition duration-500 ease-in-out font-roboto lg:px-48"
            data-theme={themeStore.mode}
          >
            {children}
          </body>{" "}
        </>
      ) : (
        <body></body>
      )}
    </>
  );
}
