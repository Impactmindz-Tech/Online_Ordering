import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
const firebaseConfig = {
  apiKey: 'AIzaSyAFlMajT4Y91h_FbpgLS_tIDzwqfM6_0Vk',
  authDomain: 'onlineordering-3025e.firebaseapp.com',
  projectId: 'onlineordering-3025e',
  storageBucket: 'onlineordering-3025e.appspot.com',
  messagingSenderId: '708945464297',
  appId: '1:708945464297:web:013ad425143ac741d75978',
  measurementId: 'G-NG3PNKQLT5',
}

export const app = initializeApp(firebaseConfig)
