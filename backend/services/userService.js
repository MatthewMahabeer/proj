const db = require("../db/pool");

async function login(idNumber, password) {
  try {
    // query the Admin table for a matching idNumber and password
    let [rows, fields] = await db.query(
      "SELECT id, name, idNumber FROM Admin WHERE idNumber = ? AND password = ?",
      [idNumber, password]
    );
    if (rows.length > 0) {
      return {
        id: rows[0].id,
        name: rows[0].name,
        role: "admin",
        id_number: rows[0].idNumber,
      };
    }

    // query the Lecturer table for a matching idNumber and password
    [rows, fields] = await db.query(
      "SELECT id, name, idNumber FROM Lecturer WHERE idNumber = ? AND password = ?",
      [idNumber, password]
    );
    if (rows.length > 0) {
      return {
        id: rows[0].id,
        name: rows[0].name,
        role: "lecturer",
        id_number: rows[0].idNumber,
      };
    }

    // query the Student table for a matching idNumber and password
    [rows, fields] = await db.query(
      "SELECT id, name, idNumber FROM Student WHERE idNumber = ? AND password = ?",
      [idNumber, password]
    );
    if (rows.length > 0) {
      return {
        id: rows[0].id,
        name: rows[0].name,
        role: "student",
        id_number: rows[0].idNumber,
      };
    }

    // if no user is found with the matching idNumber and password, throw an error
    return { error: "Invalid id number or password" };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  login,
};
