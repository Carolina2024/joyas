/* DESAFIO 5 NODE */
const express = require("express");
const app = express();
const joyasRoutes = require("../routes/joyasRoutes");

app.use(express.json());

app.use(joyasRoutes);

app.listen(3000, () => console.log("SERVIDOR ENCENDIDO en el puerto 3000"));