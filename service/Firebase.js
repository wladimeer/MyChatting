import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import moment from 'moment';
import 'firebase/database';
import { uid } from 'uid';
import 'firebase/auth';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyCnpUwRjgxBBxg_EwbIUo_e5iHC4ng_2VE',
    authDomain: 'chatting-1fdbc.firebaseapp.com',
    databaseURL: 'https://chatting-1fdbc-default-rtdb.firebaseio.com',
    projectId: 'chatting-1fdbc',
    storageBucket: 'chatting-1fdbc.appspot.com',
    messagingSenderId: '886129123350',
    appId: '1:886129123350:web:1ca517dfa009fb4856d537'
  });
}

const firedata = firebase.database;
const fireauth = firebase.auth;

function createUser(user) {
  return new Promise((resolve, reject) => {
    fireauth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((response) => {
        user.registerDate = moment().format('DD-MM-YYYY');
        (user.password = null), (user.uid = uid(32));

        AsyncStorage.setItem('user', JSON.stringify(user));
        firedata().ref('Users').push().set(user);
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
          default:
            reject('Firebase dejo de funcionar!');
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
          resolve(true);
        });
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
          default:
            reject('Firebase dejo de funcionar!');
            break;
        }
      });
  });
}

function searchUser(value) {
  return new Promise((resolve, reject) => {
    firedata()
      .ref('Users')
      .on('value', (response) => {
        response.forEach((user) => {
          if (user.val().email == value) {
            resolve(user.val());
          }
        });
      });
  });
}

function createMessage(group, form) {
  return new Promise((resolve, reject) => {
    form.date = moment().format('DD-MM-YYYY');
    form.time = moment().format('h:mm:ss a');
    form.hour = moment().format('h:mm a');

    firedata()
      .ref('Messages/' + group)
      .push()
      .set(form)
      .then((response) => {
        readMessages(group).then((response) => {
          resolve(response);
        });
      });
  });
}

function readMessages(group) {
  return new Promise((resolve, reject) => {
    firedata()
      .ref('Messages')
      .on('value', (response) => {
        response.forEach((groups) => {
          if (groups.key == group) {
            let messages = [];

            groups.forEach((message) => {
              messages.push(message.val());
            });

            resolve(messages);
          }
        });
      });
  });
}

function searchGroup(groups) {
  return new Promise((resolve, reject) => {
    firedata()
      .ref('Messages')
      .on('value', (response) => {
        if (response.val() == null) {
          resolve(groups[0]);
        } else {
          response.forEach((messageGroup) => {
            switch (messageGroup.key) {
              case groups[0]:
                resolve(groups[0]);
                break;
              case groups[1]:
                resolve(groups[1]);
                break;
              default:
                resolve(groups[0]);
                break;
            }
          });
        }
      });
  });
}

export { firedata, createUser, loginUser, createMessage, searchGroup };
