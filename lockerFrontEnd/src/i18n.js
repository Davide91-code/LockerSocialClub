import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'it', // lingua di default
    fallbackLng: 'it', // se una traduzione manca
    debug: true, // utile per sviluppo, mostra cosa sta cercando di tradurre

    resources: {
      it: {
        translation: {
  "withdraw": "Ritiro",
  "startWithdraw": "Inizia Ritiro",
  "errorStartWithdraw": "Errore inizio ritiro",
  "boxSelectedInsertPin": "Box #{{numBox}} selezionato, inserisci PIN",
  "insertValidBoxPin": "Inserisci Box e PIN validi (6 cifre)",
  "verificationSuccessOpenBox": "Verifica riuscita — ora apri il box",
  "errorVerification": "Errore verifica",
  "openBox": "Apri Box",
  "errorOpenBox": "Errore apertura box",
  "withdrawCompletedBox": "Ritiro completato nel Box #{{numBox}}!",
  "newWithdraw": "Nuovo Ritiro",
  "back": "Indietro",
  "selectedBoxNumber": "Box selezionato: #{{numBox}}",
  "insertPin6Digits": "Inserisci PIN (6 cifre)",
  "verifyPin": "Verifica PIN"
},
      },
      en: {
        translation: {
  "withdraw": "Ritiro",
  "startWithdraw": "Iniziacvcvgfghhh Ritiro",
  "errorStartWithdraw": "Errore inizio ritiro",
  "boxSelectedInsertPin": "Box #{{numBox}} selezionato, inserisci PIN",
  "insertValidBoxPin": "Inserisci Box e PIN validi (6 cifre)",
  "verificationSuccessOpenBox": "Verifica riuscita — ora apri il box",
  "errorVerification": "Errore verifica",
  "openBox": "Apri Box",
  "errorOpenBox": "Errore apertura box",
  "withdrawCompletedBox": "Ritiro completato nel Box #{{numBox}}!",
  "newWithdraw": "Nuovo Ritiro",
  "back": "Indietro",
  "selectedBoxNumber": "Box selezionato: #{{numBox}}",
  "insertPin6Digits": "Inserisci PIN (6 cifre)",
  "verifyPin": "Verifica PIN"
},
      },
    },

    interpolation: {
      escapeValue: false, // React già lo gestisce
    },
  });

export default i18n;
