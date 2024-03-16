import DBManager from "./storageManager.mjs"
class Exercise {

    constructor() {
        this.exerciseId;
        this.legs;
        this.pull;
        this.push;
        this.core;
    }

async save() {
// We know that if a user object dos not have the ID, then it cant be in the DB.

if (this.exerciseId == null) {
    return await DBManager.selectYourExercise(this);
}else{
    return await DBManager.updateYourExercise(this);
} 
}
}
export default Exercise;