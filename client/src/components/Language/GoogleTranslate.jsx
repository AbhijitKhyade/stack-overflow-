// GoogleTranslate.js
import React, { useEffect, useState } from "react";
import "./Google.css";

const GoogleTranslate = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;

      script.onerror = (error) => {
        console.error('Error loading script:', error);
        setScriptLoaded(false);
      };

      script.onload = () => {
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            { pageLanguage: "en" },
            "google_translate_element"
          );
        };
        setScriptLoaded(true);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        delete window.googleTranslateElementInit;
      };
    }
  }, [scriptLoaded]);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
