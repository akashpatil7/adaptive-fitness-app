import firebase from "firebase";
var firebaseConfig = {
    apiKey: "AIzaSyCyzB3QDnhzl7L17p__2f-QbKDv1y5G8T8",
    authDomain: "blackbird-545eb.firebaseapp.com",
    databaseURL: "https://blackbird-545eb-default-rtdb.firebaseio.com",
    projectId: "blackbird-545eb",
    storageBucket: "blackbird-545eb.appspot.com",
    messagingSenderId: "414435709063",
    appId: "1:414435709063:web:0b918f2d4f0d56bbda2822"
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

export default fire;