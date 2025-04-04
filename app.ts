import "@d3vtool/strict-env/setup";
import express from "express";
import { BACKEND } from "./src/config";
import { ExFrame } from "@d3vtool/ex-frame";
import { UsersController } from "./src/controllers/users/users-controller";
import { EventsController } from "./src/controllers/events/events-controller";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frame = new ExFrame(app);

frame.controller(UsersController);
frame.controller(EventsController);

frame.listen(BACKEND.PORT, ()=> {
    console.log(`Listening on Port ${BACKEND.PORT}...`);
});

export { app };