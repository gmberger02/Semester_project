import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes, HTTPMethods } from "../modules/httpConstants.mjs";
import Exercise from "../modules/exercises.mjs";

const EXERCISE_API = express.Router();
EXERCISE_API.use(express.json());

EXERCISE_API.post('/selectYourExercise', async (req, res) => {
    const { legs, pull, push, core } = req.body;

    try {
        // Create a new Exercise object with the received data
        let exercise = new Exercise();
        exercise.legs = legs;
        exercise.pull = pull;
        exercise.push = push;
        exercise.core = core;

        // Save the exercise to the database
        await exercise.save();

        // Respond with a success message
        res.status(HTTPCodes.SuccesfullRespons.Ok).send("Exercise saved successfully").end();
    } catch (error) {
        console.error("Error saving exercise:", error);
        res.status(HTTPCodes.ServerSideErrorrespons.InternalServererror).send("Failed to save exercise").end();
    }
});

export default EXERCISE_API;
 