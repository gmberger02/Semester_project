import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes, HTTPMethods } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/superLogger.mjs";
import DBManager from '../modules/storageManager.mjs';


const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

SuperLogger.log("A import msg", SuperLogger.LOGGING_LEVELS.CRTICAL);

/* USER_API.get('/:id', (req, res, next) =>{
    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // Return user object
})

 */

let user = [];

try {
    //const data = fs.readFileSync('user.json', 'utf8');
    //users = JSON.parse(data);
} catch (err) {
    console.error("Failed to read users from file, starting with emty array.", err);
}

let lastID = user.length > 0 ? Math.max(...user.map(user => user.userId)) : 0;

USER_API.get('/:id', (req, res, next) => {

    SuperLogger.log("Trying to get a user with id " + req.params.userId);
    SuperLogger.log("a important msg", SuperLogger.LOGGING_LEVELS.DEBUG);

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object
})

USER_API.get('/:id', (req, res, next) => {
    res.status(HTTPCodes.SuccesfullRespons.Ok).send(user).end();

})

USER_API.post('/createUser', async (req, res) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/    

    const { name, email, pswHash, yearOfBirth, weight, height } = req.body;
    if (name != "" && email != "" && yearOfBirth != "" && weight != "" && height != "" && pswHash != "") {

        const user = new User();
        user.name = name;
        user.email = email;
        user.yearOfBirth = yearOfBirth;
        user.weight = weight;
        user.height = height;
        user.pswHash = pswHash;
        console.log(user)

        const exists = await user.exsists()
        if (exists == false) {
            await user.save();
            console.log("hei",user);

            res.status(HTTPCodes.SuccesfullRespons.Ok).send("User was created").end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }
    let exists = false;

    if (!exists) {
        user.push(user);
        res.status(HTTPCodes.SuccesfullRespons.Ok).end();
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
    }

});

USER_API.put('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);

        const { name, email, password, yearOfBirth, weight, height } = req.body;

        // Kobler til databsen
        const client = new pg.Client(DBManager.credentials);
        await client.connect();

        // oppdateter user informasjonen i databasen
        const query = 'UPDATE "public"."User" SET "name" = $1, "email" = $2, "password" = $3, "yearOfBirth" = $4, "weight" = $5, "height" = $6 WHERE "id" = $7';
        const values = [name, email, password, yearOfBirth, weight, height, userId];
        const result = await client.query(query, values);

        // skjekker om oppdatetering var successful
        if (result.rowCount > 0) {
            SuperLogger.log("User updated successfully", SuperLogger.LOGGING_LEVELS.INFO);
            res.status(HTTPCodes.SuccesfullRespons.Ok).send("User updated successfully!").end();
        } else {
            SuperLogger.log("User update failed", SuperLogger.LOGGING_LEVELS.ERROR);
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("User not found!").end();
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(HTTPCodes.ServerSideErrorrespons.InternalServererror).send("Failed to update user").end();
    } finally {
        client.end(); // kobler fra databasen
    }
});

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
    const userId = parseInt(req.params.id, 10);

    const userIndex = user.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        user.splice(userIndex, 1);

        user.save();

        res.status(HTTPCodes.SuccesfullRespons.Ok).send("User deleted successfully!").end();
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("User not found!").end();
    }
});

USER_API.post('/login', async (req, res, next) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    const {email, pswHash } = req.body;

    if (email != "" && pswHash != "") {
        let user = new User();
        user.email = email;
        ///TODO: Do not save passwords.
        user.pswHash = pswHash;
        user = await user.exsists();
        if(user){
            console.log(user);
            res.status(HTTPCodes.SuccesfullRespons.Ok).send(JSON.stringify(user)).end();
            return;
        }
    }
      res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();

});

export default USER_API
