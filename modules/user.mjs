// denne siden viser hva som trengs for å lage en Single Page Application
class User {

    constructor() {
        ///TODO: Are these the correct fields for your project?
        this.userID; //unik kode for hver bruker
        this.email; 
        this.pswHash;
        this.name;
        this.username; //egen valg brukernavn
        this.dateOfBirth; //fødselsdatoen til brukere 
        this.height; //høyden til brukeren (frivillig)
        this.weight; //vekten til brukeren (frivillig)
    }
}

export default User;