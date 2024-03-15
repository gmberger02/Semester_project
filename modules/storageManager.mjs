import pg from "pg"
import SuperLogger from "./SuperLogger.mjs"
import { HTTPCodes } from "./httpConstants.mjs";

//We are using an enviorment varible to get the db credential
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {
    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? true : false
        };
    }

    async login(email, pswHash) {
        const client = new pg.Client(this.#credentials);
        await client.connect();
        const sql = 'SELECT * FROM "public"."User" WHERE email = $1 AND password = $2';
        const params = [email, pswHash];
        const output = await client.query(sql, params);
        if (output.rows.length === 1) {
            return output.rows[0];
        } 
        return null;
    }
/* HUSK Å FJERNE TEST FØR INNLEVREING  */
   /*  async test() {
        const client = new pg.Client(this.#credentials);
        await client.connect();
        await client.end();
        console.log("DATABASE TEST VIRKET");
    } */

    async updateUser(user) {
        const client = new pg.Client(this.#credentials);
    
        try {
            await client.connect();
            const output = await client.query('UPDATE "public"."User" SET "name" = $1, "email" = $2, "password" = $3, "yearOfBirth" = $5, "weight" = $6, "height" = $7 WHERE "id" = $4;', [user.name, user.email, user.pswHash, user.userId, user.yearOfBirth, user.weight, user.height]);
    
            // Check if the user was updated successfully
            if (output.rowCount > 0) {
                SuperLogger.log("User updated successfully", SuperLogger.LOGGING_LEVELS.INFO);
            } else {
                SuperLogger.log("User update failed", SuperLogger.LOGGING_LEVELS.ERROR);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            SuperLogger.log("Error updating user: " + error.message, SuperLogger.LOGGING_LEVELS.ERROR);
        } finally {
            client.end(); // Always disconnect from the database.
        }
        return user;
    }
    

    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users" where id = $1;', [user.userId]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?
            if (output.rowCount > 0) {
                SuperLogger.log("User deleted successfully",
                    SuperLogger.LOGGING_LEVELS.INFO);
            } else {
                SuperLogger.log("Could not delete user",
                    SuperLogger.LOGGING_LEVELS.ERROR);
            }
        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from you server
            console.error('Error deleting user:', error);

        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }


    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."User"("name", "email", "password", "yearOfBirth", "weight", "height" ) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;', [user.name, user.email, /* hashedPassword, */ user.pswHash, user.yeareOfirth, user.weight, user.height]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            if (output.rows.length == 1) {
                //We stored the user in the DB.
                user.userId = output.rows[0].id;
            }
        } catch (error) {
            console.error("error creating user", error);
            //TODO : Error handling?? Remember that this is a module seperate from your server
        } finally {
            client.end(); // Always disconnect from the database
        }

        return user;
    }

    /* async hashPassword(password) {
        const saltRounds = 10; // You can adjust this value based on your requirements
        return bcrypt.hash(password, saltRounds);
    }
 */
    /* For selectYourExercise */

    async selectYourExercise(exercise){
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Exercise"("legs", "pull", "push", "core" ) VALUES($1, $2, $3, $4) RETURNING ExerciseId;', [exercise.legs, exercise.pull, exercise.push, exercise.core]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            if (output.rows.length == 1) {
                //We stored the user in the DB.
                exercise.exerciseId = output.rows[0].id;
            }
        } catch (error) {
            console.error("error creating user", error);
            //TODO : Error handling?? Remember that this is a module seperate from your server
        } finally {
            client.end(); // Always disconnect from the database
        }

        return exercise;
    }

    async updateYourExercise(exercise) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('UPDATE "public"."Exercise" set "legs" = $1, "pull" = $2, "push" = $3 WHERE ExerciseId = $4 "core" = $5 ', [exercise.legs, exercise.pull, exercise.push, exercise.exerciseId, exercise.core]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?
            if (output.rowCount > 0) {
                
            }

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
            console.error('Error updating user:', error);
        } finally {
            client.end(); // Always disconnect from the database.
        }
        return exercise;

    }
}
const connectionString =process.env.ENVIORNMENT == "local" ? process.env.DB_CONNECTIONSTRING : process.env.DB_CONNECTIONSTRING_PROD;

if(connectionString == undefined){
    throw("You forgot the db connection string")
}

export default new DBManager(connectionString); 
