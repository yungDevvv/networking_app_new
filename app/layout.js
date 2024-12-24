

import "./globals.css";

export const metadata = {
  title: "Network",
  description: "Network",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="fi">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
