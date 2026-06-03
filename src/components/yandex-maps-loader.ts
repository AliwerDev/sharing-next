let yandexScriptPromise: Promise<void> | null = null;

export const loadYandexScript = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).ymaps) return Promise.resolve();
  
  if (!yandexScriptPromise) {
    yandexScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      // ru_RU lang is used as it provides the most precise and detailed geocoding coverage for Uzbekistan.
      script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
      script.async = true;
      script.onload = () => {
        const ymaps = (window as any).ymaps;
        if (ymaps) {
          ymaps.ready(() => {
            resolve();
          });
        } else {
          yandexScriptPromise = null;
          reject(new Error("Yandex Maps API loaded but ymaps object was not found."));
        }
      };
      script.onerror = () => {
        yandexScriptPromise = null;
        reject(new Error("Yandex Maps API script load failed."));
      };
      document.body.appendChild(script);
    });
  }
  return yandexScriptPromise;
};
