import 'dotenv/config'
import express from 'express' // Express is installed using npm
import USER_API from './routes/usersRoute.mjs'; // This is where we have defined the API for working with users.

import SuperLogger from './modules/SuperLogger.mjs';


//#region  Kun for rask testing, SLETT NÅR FERDIG Å TESTE


   /*  import DBManager from "./modules/storageManager.mjs"
    await DBManager.test();

    import User from "./modules/user.mjs";
    let user = new User();
    user.name = "Test"
    user.email = "email";
    user.pswHash = "psw";
    user.yearOfBirth = 2006;
    user.weight = 67;
    user.height = 178;
    
    await user.save(); */
    
//#endregion


// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);
server.use(express.json());

// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests


// Defining a folder that will contain static files.
server.use(express.static('public'));

// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);

server.post("/createUser", (req,res, next) => {
    console.log(req.body);
    if(DBManager.createUser(req.body.email, req.body.pswd, req.body.name, req.body.yearOfBirth, req.body.weight, req.body.height) === true){
        res.status(200).send(JSON.stringify({msg: "User is created"}));
    }else{
        res.status(404).send(JSON.stringify({msg: "Could not create user"}));
    }
    next();
});

server.post("/login", (req, res, next) => {
    console.log(req.body);
    if(DBManager.login(req.body.email, req.body.pswd) === true){
        res.status(200).send(JSON.stringify({msg: "User is loged in"}));
    }else{
        res.status(404).send(JSON.stringify({msg: "Password or email not correct"}));
    }
    next();
});

// A get request handler example)
server.get("/", (req, res, next) => {

    req.originalUrl

    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
