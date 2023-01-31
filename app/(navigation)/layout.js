import "@styles/globals.css";

import Navigation from "@components/Navigation/navigation";

export default function Layout({ children }) {
  return (
    <div className>
      <Navigation />
      {children}
    </div>
  );
}
