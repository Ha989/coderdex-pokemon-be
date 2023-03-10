const express = require("express");
const router = express.Router();
const fs = require("fs");


function error(mess, code) {
  const exception = new Error(mess);
  exception.statusCode = code;
  throw exception;
}

router.get("/", (req, res, next) => {
  const allowFilter = ["search", "type", "page", "limit"];

  try {
    let { page, limit, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!allowFilter.includes(key)) {
        error(`Query ${key} is not allowed`, 401);
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });

    let offset = limit * (page - 1);

    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const pokemons = db.data;

    let result = [];
    if (filterKeys.length) {
      if (filterKeys.includes("search")) {
        result = pokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(filterQuery.search.toLowerCase())
        );
      }
      if (filterKeys.includes("type")) {
        result = pokemons.filter((pokemon) =>
          pokemon.type.includes(filterQuery.type)
        );
      }
    } else {
      result = pokemons;
    }
    result = result.slice(offset, offset + limit);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// post pokemon

router.post("/", (req, res, next) => {
  const pokemonTypes = [
    "bug",
    "dragon",
    "fairy",
    "fire",
    "ghost",
    "ground",
    "normal",
    "psychic",
    "steel",
    "dark",
    "electric",
    "fighting",
    "flying",
    "grass",
    "ice",
    "poison",
    "rock",
    "water",
  ];

  try {
    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const data = db.data;

    const { id, name, type, imageLink } = req.body;
    if ((!id, !name || !type || !imageLink)) {
      error(`Missing body info`, 401);
    }

    if (
      data.find((pokemon) => pokemon.id === parseInt(id) || pokemon.name === name)) {
      error(`The Pokémon already exists`, 401);
    }

    if (type.length > 2) { error(`Pokémon can only have one or two types`, 401); }

    if ( !pokemonTypes.filter((pokemonType) => pokemonType !== type.join())
    ) {
      error(`Pokémon's type is invalid`, 401);
    }

    const newPokemon = { id: parseInt(id), name, type, imageLink };

    data.push(newPokemon);

    db.data = data;

    db = JSON.stringify(db);
    fs.writeFileSync("db.json", db);
    res.send(newPokemon);
  } catch (error) {
    next(error);
  }
});

//delete pokemon

router.delete("/:id", (req, res, next) => {
  try {
    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const data = db.data;

    const { id } = req.params;

    const targetIndex = data.find((pokemon) => {
      pokemon.id === parseInt(id);
    });

    if (targetIndex < 0) {
      error(`Pokemon not found`, 404);
    }

    db = data.filter((pokemon) => pokemon.id !== parseInt(id));

    db = JSON.stringify(db);
    fs.writeFileSync("db.json", db);
    res.send("ok");
  } catch (error) {
    next(error);
  }
});
// cấu hình eslint, extension , cách debug, viết coi sao cho sách //  cors // cookieParser , authoration, jsonwebtoke,https, htttp, , mw cách hoạt động, cấu trúc một be
//
// post(create) // thông tin đầu vào ( bắt buộc gì có), kiểm tra(trùng name , id ....), ( viết lại db.json // )
// put(update) // thông tin đầu vào (kiểm tra id === có k ), kt (kiểm tra dữ liệu, những cái k dc cập nhật), /(tìm cái id cập nhật lại trả oke)
module.exports = router;
