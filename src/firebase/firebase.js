const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(require('./key.json')),
    //databaseURL: "https://centitexoveroles-default-rtdb.firebaseio.com"
});

const firebase = admin;

module.exports = firebase;