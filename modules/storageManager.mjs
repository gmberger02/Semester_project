import pg from "pg"
import SuperLogger from "./SuperLogger.mjs"

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

    async login(email, pswHash){
        const client = new pg.Client(this.#credentials);
        await client.connect();
        const sql = "SELECT FROM User WHERE email = $1 AND pswHash = $2";
        const params = [email, pswHash];
        const output = await client.query(sql, params);
        if(output.rows.length === 1){
            return true;
        }
        return false;
    }

    async test() {
        const client = new pg.Client(this.#credentials);
        await client.connect();
        await client.end();
        console.log("DATABASE TEST VIRKET");
    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);


        try {
            await client.connect();
            const output = await client.query('Update "public"."User" set "name" = $1, "email" = $2, "password" = $3 where id = $4 "yearOfbirth" = $5 "weight" = $6 "height" = $7;', [user.name, user.email, user.pswHash, user.userId, user.yeareOfirth, user.weight, user.height]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?
            if (output.rowCount > 0){
                SuperLogger.log("User updated successfully",
            SuperLogger.LOGGING_LEVELS.INFO);
            }else{
                SuperLogger.log("User update failed",
            SuperLogger.LOGGING_LEVELS.ERROR);
            }
        

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
            console.error('Error updating user:', error);
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
            }else{
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
            const output = await client.query('INSERT INTO "public"."User"("name", "email", "password", "yearOfBirth", "weight", "height" ) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;', [user.name, user.email, user.pswHash, user.yeareOfirth, user.weight, user.height]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            if (output.rows.length == 1) {
                //We stored the user in the DB.
                user.userId = output.rows[0].userId;
            }
        } catch (error) {
            console.error ("error creating user", error);
            //TODO : Error handling?? Remember that this is a module seperate from your server
        } finally {
            client.end(); // Always disconnect from the database
        }

        return user;
    }
}
 
export default new DBManager(process.env.DB_CONNECTIONSTRING); 