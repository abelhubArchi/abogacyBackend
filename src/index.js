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



//cors
const cors = require('cors');
const { log } = require('console');
var corsOptions = {
  origin: ["https://abogacyio.netlify.app", "http://192.168.0.18:5173"],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Habilita las credenciales si es necesario
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));



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