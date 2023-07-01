const sql = require("mssql/msnodesqlv8");
const config = require("./config.json");

const conn = new sql.ConnectionPool(config);

conn.connect(config).then(() => {
    console.log("connect to local db!");
})


function queryAllFortuneCookies() {
    console.log("get all fortune cookies!");
  }


module.exports = { queryAllFortuneCookies }

