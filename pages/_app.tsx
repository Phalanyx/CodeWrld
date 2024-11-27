import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import type { AppProps } from "next/app";
import NavBar from "@/pages/components/Navbar";
import { AppProvider } from "@/lib/AppVars";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";


export default function App({ Component, pageProps }: AppProps) {
  
  useEffect(() => {
    document.title = "Scriptorium";
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = "/logo.jpg";
    document.head.appendChild(link);
  }, []);

  const router = useRouter();

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, []);

  const baseFolder = router.pathname.substring(router.pathname.lastIndexOf("?") + 1) || "";

  return (
    <AppProvider>
      <NavBar />
      <AnimatePresence mode="wait">
        <motion.div
          key={baseFolder}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </AppProvider>
  );
}