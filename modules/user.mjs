import DBManager from "./storageManager.mjs"
class User {

    constructor() {
        this.userId // vente med denne til databaser
        this.email;
        this.pswHash;
        this.name;
        this.yearOfBirth;
        this.weight;
        this.height;
    }
    async save() {
        //TODO: What happens if the DBManager fails to complete its task?
    // We know that if a user object dos not have the ID, then it cant be in the DB.

    if (this.userId == null) {
        return await DBManager.createUser(this);
    }else{
        return await DBManager.upgardeUser(this);
    } 
    }

    delete() {
        //TODO: What happens if the DBManager fails to complete its task?
        DBManager.deleteUser(this); 
    }
}

export default User;
