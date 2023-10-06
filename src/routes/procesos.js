const express = require('express');
const router = express.Router();
const admin = require('./../firebase/firebase.js');
const {Configuration, OpenAIApi} = require('openai')
//openai Configuracion
const configuracion = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuracion);




var db = admin.firestore();
var FieldValue = admin.firestore.FieldValue;


//obtener chat
router.post('/chat/:id/:caso/procesos/:funcion', async (req, res) => {
    var chatDocumentDigital = JSON.parse(req.body.data)
    //chatDocumentDigital.unshift({'role': 'system', 'content': `Eres Abogacy un consejero judicial especializado en Bolivia creado en El Alto. Explicame el Siguiente documento. Genera un Array con todas la Leyes, Articulos, etc; de el siguiente documento que te dara el usuario:`})
      chatDocumentDigital.unshift({'role': 'system', 'content':
       `Eres Abogacy un consejero judicial especializado en Bolivia creado en El Alto`})

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 10,
        messages: chatDocumentDigital,
      })
    //y subimos a el chat a la  base de datos
    chatDocumentDigital.push(completion.data.choices[0].message)
    await db.collection('usuarios').doc(req.params.id).collection('casos').doc(req.params.caso).set({data: chatDocumentDigital})
    //enviamos lo ultimo que dijo la IA
    res.json(completion.data.choices[0].message)
    console.log(completion.data.choices[0].message); 
}); 





module.exports = router;

