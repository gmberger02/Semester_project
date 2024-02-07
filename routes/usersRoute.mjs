import express, { response } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes, HTTPMethods } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";





const USER_API = express.Router();
USER_API.use(express.json); // This makes it so that express parses all incoming payloads as JSON for this route.

let users = [];

try{
    const data = fs.readFileSync('user.json', 'utf8');
    users = JSON.parse(data);
}catch(err){
    console.error("Failed to read users from file, starting with emty array.", err);
}

function saveUsers(){
    fs.writeFile('users.json', JSON.stringify(users), 'utf8', (err) =>{
        if(err){
            console.error("Error writing users to file:", err);
            return res.status (HTTPCodes.ServerSideErrorrespons.InternalServererror).send("Failed to save user").end();
        }
    });
}

let lastID = users.length > 0 ? Math.max(...users.map(user => users.id)) : 0;


USER_API.get('/:id',(req, res, next) => {

    SuperLogger.log("Trying to get a user with id " + req.params.id);
    SuperLogger.log("a important msg", SuperLogger.LOGGING_LEVELS.DEBUG); 

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object
})

USER_API.get('/:id',(req, res, next) => {
    res.status(HTTPCodes.SuccesfullRespons.Ok).send(users).end();

})

USER_API.post('/', (req, res, next) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    const { name, email, password } = req.body;

    if (name != "" && email != "" && password != "") {
        const user = new User();
        user.name = name;
        user.email = email;
        console.log(users)

        ///TODO: Do not save passwords.
        user.pswHash = password;
        const exists = users.some(user => user.email === email);


        ///TODO: Does the user exist?
    
        if (!exists) {
            const id = ++lastId;
            const user = { id, name, email, password };


            users.push(user);
            saveUsers();

            res.status(HTTPCodes.SuccesfullRespons.Ok).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

    ///TODO: Does the user exist?
    let exists = false;

    if (!exists) {
        users.push(user);
        res.status(HTTPCodes.SuccesfullRespons.Ok).end();
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
    }

});

USER_API.put('/:id', (req, res) => {
    /// TODO: Edit user
    const userId = parseInt(req.params.id, 10);
    const { name, email, password } = req.body;

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {

        users[userIndex].name = name !== undefined ? name : users[userIndex].name;
        users[userIndex].email = email !== undefined ? email : users[userIndex].email;

        saveUsers();

        res.status(HTTPCodes.SuccesfullRespons.Ok).send("User updated successfully!").end();    
    }else{
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("User not found!").end();
    }
});

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
   const userId = parseInt(req.params.id, 10);

   const userIndex = users.findIndex(user => user.id === userId);

   if (userIndex !== -1) {
    users.splice(userIndex, 1);

    saveUsers();

    res.status(HTTPCodes.SuccesfullRespons.Ok).send("User deleted successfully!").end();
   }else{
    res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("User not found!").end();
   }
});

export default USER_API
