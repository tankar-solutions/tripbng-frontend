import { Poppins } from "next/font/google";
import "../style/globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ClientLayout from "./ClientLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Tripbookngo",
  description: "Generated by create next app",
};

const LazyLoading = dynamic(() => import("../components/ui/loading"), {
  ssr: false, // Ensure the loading spinner doesn't render on the server
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased bg-background text-foreground leading-relaxed",
          poppins.className
        )}
      >
        <Navbar />
        <main className="pt-20">
          <Suspense fallback={<LazyLoading />}>{children}</Suspense>
        </main>
        <Toaster position="bottom-right" reverseOrder={false} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
