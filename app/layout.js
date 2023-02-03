import "@styles/globals.css";
import { AuthProvider } from "@context/AuthContext";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>SyncSpace</title>
      </head>
      <body>
        <div>
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
