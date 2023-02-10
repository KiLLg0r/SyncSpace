"use client";

import "@styles/globals.css";
import { AuthProvider } from "@context/AuthContext";
import Username from "@components/Username/username";
import { useState, useEffect } from "react";
import LoadingComponent from "@components/Loading/loading";

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>SyncSpace</title>
      </head>
      <body>
        <div>
          <AuthProvider>
            {loading && <LoadingComponent />}
            <Username>{children}</Username>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
