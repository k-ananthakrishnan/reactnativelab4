import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDQTPfI4dTQkfSJTHMg2TCVVKtyB29kpHs",
    authDomain: "reactnativecabs.firebaseapp.com",
    projectId: "reactnativecabs",
    storageBucket: "reactnativecabs.appspot.com",
    messagingSenderId: "69365853537",
    appId: "1:69365853537:web:73e06bb48f991b3114a920"
  };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };