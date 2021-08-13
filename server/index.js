const express = require('express');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// ------ ROUTERS IMPORT START ---------//
const authRouter = require('./routers/authRouter');
const envelopeRouter =require('./routers/envelopeRouter');
const documentRouter = require('./routers/documentRouter');
// ------ ROUTERS IMPORT END ---------//

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------ SESSIONS START ---------//
const oneDay = 1000 * 60 * 60 * 24;
app.use(cookieParser());
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
// ------ SESSIONS END ---------//

const cors = require("cors"); 
app.use(cors({
  origin:true,
  credentials: true,
}));

// ------ MONGODB  --------
mongoose.connect('mongodb+srv://sdmuhsin:RJsfmSHuGYEXOPQ3@cluster0.spwju.mongodb.net/docusign?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connection succesful");
});

// ------ ROUTERS PATH START ---------//
app.use('/auth',authRouter);
app.use('/envelope',envelopeRouter);
app.use('/document',documentRouter);
// ------ ROUTERS PATH END ---------//
app.get('/', (req, res) => {
  res.send('Hello World! ' + JSON.stringify(req.params));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});