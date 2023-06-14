"use client";

import { useThemeStore } from "@/store";
import { ReactNode, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

export default function Hydrate({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const themeStore = useThemeStore();

  // Wait till NextJs rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return (
    <SessionProvider>
      {isHydrated ? (
        <body
          className="px-0 mb-4 transition duration-500 ease-in-out font-roboto"
          data-theme={themeStore.mode}
        >
          <div className="flex flex-col min-h-screen">{children}</div>
        </body>
      ) : (
        <body></body>
      )}
    </SessionProvider>
  );
}
