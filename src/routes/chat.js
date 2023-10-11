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
router.get('/chat/:id/:caso', async (req, res) => {
    console.log(req.params.id);
    //opeaiProceso
    var textDatabase = await db.collection('usuarios').doc(req.params.id).collection('casos').doc(req.params.caso).get();
    console.log(textDatabase);
    res.json(textDatabase.data())
    //res.json('FISCALIA ESPECIALIZADA EN RAZON DE GÉNERO Y JUVENIL DE LACIUDAD DE EL ALTO.CUD 201502022208702Fiscal: Dra. Lorena Vargas QuisbertPROPONE PRUEBA AUDIVISUAL Y PIDE SUsegiria Aamco DESDOBLAMIENTOOTROSI.- DOMICILIOJULIO VELASCO MAMANI, EVELING SARAH CHAUCA MAMANI Y LUISAMAMANI VELASCO, en el proceso penal investigativo, seguido por elMINISTERIO PUBLICO en contra de AVELINA VELASCO POMA, AGUSTINMEDRANO VELASCO, MARTIN HORACIO MEDRANO VELASCO, SANDRAMEDRANO VELASCO y BERTHA MEDRANO VELASCO, por el delito deviolencia familiar o domestica, ante usted respetuosos manifestamos ypedimos:Como medida de prevención contra los constantes asedios que sufrimos lasvíctimas, hemos instalado cámaras de seguridad en nuestra casa ubicada en lazona orkojipiña, que resulta ser el escenario del hecho y verificado en elregistro del lugar del hecho.amit ng behaveje els babinotusEn fecha 29 de septiembre de 2022 entre horas 14.30 y 15.00, los hoydenunciados en grupo nos han violentado a las victimas cuandopermanecíamos pacíficamente en nuestra casa, han llegado en un motorizadocon placa 138 ZZL tipo Jepp, color beige conducido por Martin HoracioMedrano Velasco, al mando del motorizado ha destruido los postes de maderaque protegen nuestra casa y el portón principal de la casa, chocando con elmotorizado y derribándolos, luego del vehículo descendieron los otros violentosen grupo y han ingresado a nuestra casa, donde nos han pegado armados conpalo que tenia clavos y piedras, causándonos lesiones a todas las víctimas.Todas estas escenas fueron captados por la cámara de seguridad, donde sepuede identificar a cada uno de los participes violentos, se puede ver el uso deobjetos contusos, se puede oír todo lo que han dicho y ver a cada uno de losparticipes, el mecanismo de ataque físico y demás circunstancias, esta pruebaes útil necesaria y determinante para establecer el lugar el tiempo participos')
  }); 



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

