import "@styles/globals.css";

import Navigation from "@components/Navigation/navigation";

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
