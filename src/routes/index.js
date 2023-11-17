const express = require('express'); 
const router = express.Router();
const vision = require('@google-cloud/vision')
const admin = require('./../firebase/firebase.js');
// Creates a client
const credentials = require('./../../key.json');
const client = new vision.ImageAnnotatorClient({credentials});

var db = admin.firestore();

router.get('/', (req, res) => { 
    res.send(`ABIGAIL TE AMO TANTO, TE NECESITO EN MI VIDA POR QUE TU ERES LO UNICO QUE ME HACE FELIZ, 
    TUS OJOS TU CARITA Y TUS HERMSOS LABIOS JUNTO A TUS LUNARES, 
    ME ENAMORASTE CON TODO MI AMOR.
    DE: ABEL MAURO ESCOBAR LARICO CON TODO SU AMOR A: ABIGAIL ALIZON CONDORI CONDORI. PSDT: ESPERO PODER ESTAR CONTIGO EN ESTA VIDA
    Y SI NO ES CONTIGO TE PROMETO BUSCARTE EN LA SIGUIENTE.
    NO SABES COMO ODIO AL YUVAL ABI LO ODIO CON TODO MI SER, CON TODO MI ODIO LO ODIOOOO. ME QUIETO LO MAS PRECIADO PARA MI, TU...
    \n

    DE JOHAN OBED JIMENEZ PARA CIELO FLORES CONDORI DICE LO SIGUIENTE => 
     
    `)
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
