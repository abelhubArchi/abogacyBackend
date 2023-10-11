const express = require('express');
const multer = require('multer')
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
//multer
const storage =  multer.diskStorage({
  destination: path.join(__dirname, 'documents'),
  filename: (req, file, cb) =>{
    cb(null, file.originalname);
  }
})

app.use(bodyParser.json())


//midelware
app.use(multer({
  storage: storage,
  dest: path.join(__dirname, 'documents')
}).array("documents"));



// Configurar el encabezado para permitir solicitudes desde cualquier origen
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// settings
app.set('port', process.env.PORT || 3000);
log(process.env.PORT || 3000)

// routes

app.use(require('./routes/index.js'));
app.use(require('./routes/chat.js'));
app.use(require('./routes/casos.js'))
app.use(require('./routes/documentsDigitalChat.js'))
app.use(require('./routes/procesos.js'))
console.log(console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS));
// listening the Server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});