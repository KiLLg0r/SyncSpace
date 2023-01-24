import "../styles/globals.css";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>SyncSpace</title>
      </head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
