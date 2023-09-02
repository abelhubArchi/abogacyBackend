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



module.exports = router;
