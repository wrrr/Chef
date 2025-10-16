import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_TRACKING_ID = "G-TF32R5B1DF";

export default function GA() {
  const location = useLocation();

  useEffect(() => {
    // Inject GA script only once
    if (!window.gtag) {
      const script1 = document.createElement("script");
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      script1.async = true;
      document.body.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', { 'send_page_view': false });
      `;
      document.body.appendChild(script2);
    }

    // Track page view on route change
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
}