import express from "express";
import ClassesController from "./controllers/ClassesController";

const classesController = new ClassesController();

const routes = express.Router();

routes.get("/classes", classesController.index);
routes.post("/classes", classesController.create);

export default routes;