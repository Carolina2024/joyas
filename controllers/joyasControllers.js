const pool = require("../config/config");
const format = require("pg-format");

// prepara la estructura HATEOAS
const prepararHATEOAS = (inventario, stockTotal) => {
  const results = inventario.map((j) => {
      return {
        name: j.nombre,
        href: `/joyas/joya/${j.id}`,
      };
    })
  const totalJoyas = inventario.length;
  const HATEOAS = {
    totalJoyas,
    stockTotal,
    results,
  };
  return HATEOAS;
};

// funcion para obtner las joyas
const obtenerJoyas = async ({limits = 10, order_by = "id_ASC", page = 1,}) => {
  const [campo, direccion] = order_by.split("_");
  const offset = (page - 1) * limits;
  const formattedQuery = format("SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
    campo,
    direccion,
    limits,
    offset
  );
  pool.query(formattedQuery);
  const { rows: inventario } = await pool.query(formattedQuery);
  const stockTotal = inventario.reduce((total, item) => total + item.stock, 0);
  return { inventario, stockTotal };
};


// funcion para filtrar las joyas
const obtenerJoyasPorFiltros = async ({ precio_max, precio_min, categoria, metal }) => {
  let filtros = [];
  const values = [];
  /* ejecutada solo en caso de que se validen la existencia de los parámetros en la query string */
  // REQUERIMIENTO 5 consultas parametrizadas
  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push(`${campo} ${comparador} $${length + 1}`);
  };
  if (precio_max) agregarFiltro("precio", "<=", precio_max);
  if (precio_min) agregarFiltro("precio", ">=", precio_min);
  if (categoria) agregarFiltro("categoria", "=", categoria);
  if (metal) agregarFiltro("metal", "=", metal);

  let consulta = "SELECT * FROM inventario";
  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += ` WHERE ${filtros}`;
  }
  const { rows: joyas } = await pool.query(consulta, values);
  return joyas;
};

// REQUERIMIENTO 3 middleware
const reportarConsulta = async (req, res, next) => {
  const queryParams = req.query;
  const url = req.url;
  console.log(`
  Hoy ${new Date()}
  Se ha recibido una consulta en la ruta ${url}
  con los parámetros:
  `, queryParams);
  next();
};

module.exports = {
  obtenerJoyas,
  prepararHATEOAS,
  obtenerJoyasPorFiltros,
  reportarConsulta,
};