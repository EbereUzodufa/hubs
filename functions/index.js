const functions = require('firebase-functions');
const express = require('express')
require('./config/firebaseSetup')
const authRoute = require('./routes/authRoutes')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const app = express();

//Scream Routes

// Authentication Routes
app.use('/v1/auth',authRoute)

exports.api = functions.https.onRequest(app)