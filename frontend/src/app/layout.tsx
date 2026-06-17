import { plusJakartaSans, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s==="light"||s==="dark"?s:d?"dark":"light";document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="site-bg flex min-h-dvh flex-col text-foreground">{children}</body>
    </html>
  );
}
