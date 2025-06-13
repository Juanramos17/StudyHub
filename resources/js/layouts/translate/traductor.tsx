import { useEffect } from "react";
import "./css/GoogleTranslateGood.css";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }

  const google: any;
}

const GoogleTranslate = () => {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new google.translate.TranslateElement(
        {
          pageLanguage: "", // Auto-detección
          includedLanguages: "es,en,fr,de,it,pt,ja,ko", // Idiomas disponibles
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
    
  }, []);

  return (
    <div>
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
