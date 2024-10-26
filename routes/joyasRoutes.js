const express = require("express");

const {
  obtenerJoyas,
  prepararHATEOAS,
  obtenerJoyasPorFiltros,
  reportarConsulta,
} = require("../controllers/joyasControllers");

const router = express.Router();

//REQUERIMIENTO 1 ruta GET/joyas
// REQUERIMIENTO 4 try catch en cada ruta, solo necesario en las rutas como indicó la profesora
/* localhost:3000/joyas */
/* http://localhost:3000/joyas?limits=3&page=2&order_by=stock_ASC */
router.get("/joyas", reportarConsulta, async (req, res) => {
  try {
  const queryStrings = req.query;
  const { inventario, stockTotal } = await obtenerJoyas(queryStrings);
  const HATEOAS = prepararHATEOAS(inventario, stockTotal);
  res.json(HATEOAS);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las joyas" });
  }
});

// REQUERIMIENTO 2 GET/jpyas/filtros
/* http://localhost:3000/joyas/filtros?precio_min=25000&precio_max=30000&categoria=aros&metal=plata */
router.get("/joyas/filtros", reportarConsulta, async (req, res) => {
  try {
  const queryStrings = req.query;
  const joyas = await obtenerJoyasPorFiltros(queryStrings);
  res.json(joyas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las joyas filtradas" });
  }
});

module.exports = router;