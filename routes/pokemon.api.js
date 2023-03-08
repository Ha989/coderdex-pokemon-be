const express = require('express');
const router = express.Router();
const fs = require('fs');
const crypto = require("crypto");


router.get("/", (req,res,next) => {
  const allowFilter = [
      "search",
      "type",
      "page",
      "limit"
  ];
  try {
    let { page, limit, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
        if (!allowFilter.includes(key)) {
            const exception = new Error(`Query ${key} is not allowed`);
            throw exception;
        }
        if (!filterQuery[key]) delete filterQuery[key];
    });

    let offset = limit * (page - 1);
    let db = fs.writeFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    console.log("db", db);
    const { pokemons } = db;
    let result = [];

    if (filterKeys.length) {
        filterKeys.forEach((condition) => {
           result = result.length 
           ? result.filter((pokemon) => pokemon[condition] === filterQuery[condition])
           : pokemons.filter((pokemon) => pokemon[condition] === filterQuery[condition])       
        });
    } else {
      result = pokemons;
    }
    result = result.slice(offset, offset + limit);
    res.send(200).send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;