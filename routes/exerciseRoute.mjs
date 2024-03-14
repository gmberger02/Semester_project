import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes, HTTPMethods } from "../modules/httpConstants.mjs";
import Exercise from "../modules/exercises.mjs";

const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

let exercise = [];

USER_API.post('/selectYourExercise', async(req, res) => {

const { legs, pull, push, core } = req.body;
    if (legs != "" && pull != "" && push != "" && core != "") {
        
        const exercise = new Exercise;
        exercise.legs = legs;
        exercise.pull = pull;
        exercise.push = push;
        exercise.core = core;
        console.log(exercise)
    
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});
