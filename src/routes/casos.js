const express = require('express');
const router = express.Router();
const admin = require('./../firebase/firebase.js');


var db = admin.firestore();


router.get('/casos/:id/getCase', async (req, res) => {
        const listaCasos = await db.collection('usuarios').doc(req.params.id).collection('casos');
        listaCasos.get().then(snapshot=>{
            const casos = [];
            snapshot.forEach(doc => {
                casos.push({id: doc.id});
            });
            console.log(casos);
             res.json(casos)
        });
        
});

router.post('/casos/:id/postCreateCase', async(req, res)=>{
    const data = [{"role": "system", "content": "Eres Abogacy y eres un consejero judicial, Fuiste Creado por la Empresa Abogacy, tu creador es Alexis Avila Caparicona"}]
    db.collection('usuarios').doc(req.params.id).collection('casos').doc(req.body.newCase).set({data}).then(()=>{
        res.sendStatus(200)
     
    })
    
})

//Guardar mensaje recibido
router.post('/chat/:id/:caso/enviar', async (req, res) => {
    //imprimimos el valor del fronted
    console.log(req.body.data);
    //convertimops a objetos json
    var datajson = JSON.parse(req.body.data);
    //lo subimos a gpt
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 50,
      messages: datajson,
    })
    //hacemos un push de la respuesta a datajson  
    datajson.push(completion.data.choices[0].message)
    //imprimimos el ultimos dato
    console.log(datajson);
    //y subimos a el chat a la  base de datos
    await db.collection('usuarios').doc(req.params.id).collection('casos').doc(req.params.caso).set({data: datajson})

    //enviamos lo ultimo que dijo la IA
    res.json(completion.data.choices[0].message)
  });



module.exports = router;
