"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Dashboard-components/common/Loader";
import DefaultLayout from "@/components/Dashboard-components/Layouts/DefaultLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div>
      <div suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <DefaultLayout>
          {loading ? <Loader /> : children}
          </DefaultLayout>
        </div>
      </div>
    </div>
  );
}
