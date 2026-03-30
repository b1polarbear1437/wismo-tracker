import "./globals.css";

export const metadata = {
  title: "WISMO AI Tracker",
  description: "AI-powered order inquiry analyzer for e-commerce support teams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
