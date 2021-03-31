import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import moment from 'moment';
import 'firebase/database';
import { uid } from 'uid';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCnpUwRjgxBBxg_EwbIUo_e5iHC4ng_2VE',
  authDomain: 'chatting-1fdbc.firebaseapp.com',
  databaseURL: 'https://chatting-1fdbc-default-rtdb.firebaseio.com',
  projectId: 'chatting-1fdbc',
  storageBucket: 'chatting-1fdbc.appspot.com',
  messagingSenderId: '886129123350',
  appId: '1:886129123350:web:1ca517dfa009fb4856d537'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firedata = firebase.database;
const fireauth = firebase.auth;

function createUser(user) {
  return new Promise((resolve, reject) => {
    fireauth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((response) => {
        user.registerDate = moment().format('DD-MM-YYYY');
        user.password = null;
        user.uid = uid(32);

        AsyncStorage.setItem('user', JSON.stringify(user));
        database.ref('Users').push().set(user);
        resolve(true);
      })
      .catch((response) => {
        switch (response.code) {
          case 'auth/invalid-email':
            reject('Verifica el correo ingresado!');
            break;
          case 'auth/email-already-exists':
            reject('El corrreo ingresado ya existe!');
            break;
          case 'auth/weak-password':
            reject('La contraseña es muy corta!');
            break;
          case 'auth/email-already-in-use':
            reject('El correo se está utilizando!');
            break;
        }
      });
  });
}

function loginUser(form) {
  return new Promise((resolve, reject) => {
    fireauth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then((response) => {
        searchUser(form.email).then((response) => {
          AsyncStorage.setItem('user', JSON.stringify(response));
        });
        resolve(true);
      })
      .catch((response) => {
        switch (response.code) {
          case 'auth/invalid-email':
            reject('Verifica el correo ingresado!');
            break;
          case 'auth/wrong-password':
            reject('La contraseña no coincide!');
            break;
          case 'auth/user-not-found':
            reject('El usuario ingresado no existe!');
            break;
          case 'auth/too-many-requests':
            reject('Demasiados intentos fallidos!');
            break;
        }
      });
  });
}

function readUsers() {
  return new Promise((resolve, reject) => {
    firedata()
      .ref('Users')
      .once('value', (response) => {
        let users = [];

        response.forEach((user) => {
          users.push({
            uid: user.key,
            name: user.val().name,
            email: user.val().email,
            lastnames: user.val().lastnames,
            register: user.val().registerDate
          });
        });

        resolve(users);
      });
  });
}

function searchUser(email) {
  return new Promise((resolve, reject) => {
    firedata()
      .ref('Users')
      .once('value', (response) => {
        response.forEach((user) => {
          if (user.val().email == email) {
            resolve(user.val());
          }
        });
      });
  });
}

export { createUser, loginUser, readUsers, searchUser };
