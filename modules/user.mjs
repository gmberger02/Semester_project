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

    async save(){

    if(this.userId == null) {
        return await DBManager.createUser(this);
    } else {
        return await DBManager.updateUser(this);
    }
}

    async delete() {
        //TODO: What happens if the DBManager fails to complete its task?
        await DBManager.deleteUser(this); 
    }

    async exsists(){

        let user = await DBManager.login(this.email, this.pswHash);
        if(user){
            this.userId = user.id;
            this.name = user.name;
            this.yearOfBirth = user.yearOfBirth;
            this.weight = user.weight;
            this.height = user.height;
            return true;
        }
        return false
    }

    


}




export default User;
