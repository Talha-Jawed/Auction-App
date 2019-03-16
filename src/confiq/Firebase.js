import * as firebase from 'firebase'

var config = {
    apiKey: "AIzaSyAcXqMibn6yqEt0xX-cydDTe9UfaYkLpaM",
    authDomain: "auction-7375d.firebaseapp.com",
    databaseURL: "https://auction-7375d.firebaseio.com",
    projectId: "auction-7375d",
    storageBucket: "auction-7375d.appspot.com",
    messagingSenderId: "685560939023"
};
firebase.initializeApp(config);

export default firebase