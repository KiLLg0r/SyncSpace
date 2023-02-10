import "@styles/globals.css";
import { AuthProvider } from "@context/AuthContext";
import Username from "@components/Username/username";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>SyncSpace</title>
      </head>
      <body>
        <div>
          <AuthProvider>
            <Username>{children}</Username>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
