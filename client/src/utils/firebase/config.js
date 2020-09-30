import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyDDdkCElldoA4YptJ_0GVenK8ru3-n6m3U',
  authDomain: 'fir-gallery-c070d.firebaseapp.com',
  databaseURL: 'https://fir-gallery-c070d.firebaseio.com',
  projectId: 'fir-gallery-c070d',
  storageBucket: 'fir-gallery-c070d.appspot.com',
  messagingSenderId: '538177884017',
  appId: '1:538177884017:web:186cffb8cf82ea8369f0d0',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage();
const projectFireStore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectStorage, projectFireStore, timestamp };
