declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => GoogleTranslateElement;
      };
    };
  }
}

// Define a minimal interface based on typical Google Translate behavior
interface GoogleTranslateElement {
  // Methods commonly associated with Google Translate elements
  show?: () => void;
  hide?: () => void;
  // Add more specific methods/properties if you know them from the API
}

export {};