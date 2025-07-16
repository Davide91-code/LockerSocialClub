import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'it', // lingua di default
    fallbackLng: 'it', // se una traduzione manca. Nel caso si generi un bug, fare questo switch ci permette di capire da che lato è situata l'assenza
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
  "verifyPin": "Verifica PIN",
  "postWithdraw": "Apertura box riuscita, ritiro completato",
  "boxOccupied": "Box Occupati",
  "boxAvailable": "Box Disponibili",
  "pinMinLengthError": "Il PIN deve essere almeno di 6 cifre",
  "boxOpenedSuccess": "Box aperto con successo!",
  "pinSaveError": "Errore nel salvataggio pin",
  "pinEntered": "PIN inserito",
  "setPin": "Imposta PIN",
  "backToHome": "Torna alla Home",
  "pinErrorExample": "Errore PIN esempio",
  "deposit": "Deposito",
  "startDeposit": "Inizia Deposito",
  "startDepositError": "Errore nel creare operazione deposito",
  "boxReserved": "Box #{{numBox}} selezionato e riservato",
  "selectBoxError": "Errore nella selezione del box",
  "depositCompleted": "Deposito completato nel Box #{{numBox}}!",
  "newDeposit": "Nuovo Deposito",
  "welcome": "Benvenuto"
  
  
},
      },
      en: {
  translation: {
  "withdraw": "Withdraw",
  "startWithdraw": "Start Withdraw",
  "errorStartWithdraw": "Error starting withdrawal",
  "boxSelectedInsertPin": "Box #{{numBox}} selected, enter PIN",
  "insertValidBoxPin": "Enter valid Box and 6-digit PIN",
  "verificationSuccessOpenBox": "Verification successful — now open the box",
  "errorVerification": "Verification error",
  "openBox": "Open Box",
  "errorOpenBox": "Box opening error",
  "withdrawCompletedBox": "Withdraw completed in Box #{{numBox}}!",
  "newWithdraw": "New Withdraw",
  "back": "Back",
  "selectedBoxNumber": "Selected Box: #{{numBox}}",
  "insertPin6Digits": "Enter PIN (6 digits)",
  "verifyPin": "Verify PIN",
  "postWithdraw": "Box successfully opened, withdrawal completed",
  "boxOccupied": "Box Occupied",
  "boxAvailable": "Box Available",
  "pinMinLengthError": "PIN must be at least 6 digits",
  "boxOpenedSuccess": "Box successfully opened!",
  "pinSaveError": "Error saving pin",
  "pinEntered": "PIN entered",
  "setPin": "Set PIN",
  "backToHome": "Back to Home",
  "pinErrorExample": "Errore PIN",
  "deposit": "Deposit",
  "startDeposit": "Start Deposit",
  "startDepositError": "Error creating Deposit operation",
  "boxReserved": "Box #{{numBox}} selected and reserved",
  "selectBoxError": "Error selecting box",
  "depositCompleted": "Deposit completed in box #{{numBox}}!",
  "newDeposit": "New Deposit",
  "welcome": "Welcome"
  }
},
es: {
  translation: {
  "withdraw": "Retiro",
  "startWithdraw": "Iniciar Retiro",
  "errorStartWithdraw": "Error al iniciar el retiro",
  "boxSelectedInsertPin": "Box #{{numBox}} seleccionado, ingresa el PIN",
  "insertValidBoxPin": "Ingresa un Box y PIN válidos (6 dígitos)",
  "verificationSuccessOpenBox": "Verificación exitosa — ahora abre el box",
  "errorVerification": "Error en la verificación",
  "openBox": "Abrir Box",
  "errorOpenBox": "Error al abrir el box",
  "withdrawCompletedBox": "¡Retiro completado en el Box #{{numBox}}!",
  "newWithdraw": "Nuevo Retiro",
  "back": "Atrás",
  "selectedBoxNumber": "Box seleccionado: #{{numBox}}",
  "insertPin6Digits": "Ingresa el PIN (6 dígitos)",
  "verifyPin": "Verificar PIN",
  "postWithdraw": "Apertura del box exitosa, retiro completado",
  "boxOccupied": "Boxes Ocupados",
  "boxAvailable": "Boxes Disponibles",
  "pinMinLengthError": "El PIN debe tener al menos 6 dígitos",
  "boxOpenedSuccess": "¡Box abierto con éxito!",
  "pinSaveError": "Error al guardar el PIN",
  "pinEntered": "PIN ingresado",
  "setPin": "Establecer PIN",
  "backToHome": "Volver al inicio",
  "pinErrorExample": "Ejemplo de error de PIN",
  "deposit": "Depósito",
  "startDeposit": "Iniciar Depósito",
  "startDepositError": "Error al crear la operación de depósito",
  "boxReserved": "Box #{{numBox}} seleccionado y reservado",
  "selectBoxError": "Error al seleccionar el box",
  "depositCompleted": "¡Depósito completado en el Box #{{numBox}}!",
  "newDeposit": "Nuevo Depósito",
  "welcome": "Bienvenido"
}
},

    
    },

    interpolation: {
      escapeValue: false, // React già lo gestisce
    },
  });

export default i18n;
