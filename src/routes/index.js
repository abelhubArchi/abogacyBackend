const express = require('express'); 
const router = express.Router();
const vision = require('@google-cloud/vision')
const admin = require('./../firebase/firebase.js');
// Creates a client
const credentials = require('./../../key.json');
const client = new vision.ImageAnnotatorClient({credentials});

var db = admin.firestore();

router.get('/', (req, res) => { 
    res.send('hola Johan esta es nuestra inversion, y esta en internet... Psdt: Eres un gay')
  });



  router.post('/subirImagenes/:id/:caso', async (req, res)=>{
    console.log(req.files);
    admin.auth().verifyIdToken(req.headers['authorization'])
    .then(async (deodedToken)=>{
      var responseDocumentText = [];
      for (let i = 0; i < req.files.length; i++) {
        const [result] = await client.textDetection(req.files[i].path);
        console.log(result);
        const detections = result.textAnnotations;
        
         responseDocumentText.push(detections[0].description) 
      }

      db.collection('usuarios').doc(req.params.id).collection('casos').doc(req.params.caso).set({
        chat: [{documentDigital: responseDocumentText.join(' \n')}]
      });

      res.json(responseDocumentText)

  
    })
    .catch((error)=>{
      res.status(401)
    })
  
  });
  router.post('/editarDescripcion/:id/:caso', async (req, res)=>{
    admin.auth().verifyIdToken(req.headers['authorization'])
    .then(async (deodedToken)=>{
      db.collection('usuarios').doc(req.params.id).collection('casos').doc(req.params.caso).set({
        chat: req.body.documentEdit
      }).then(()=>{
        res.json({estado: 'ok'})
      });
    })
  })
  
  

  
     
module.exports = router;
