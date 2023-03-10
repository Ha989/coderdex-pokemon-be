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
          pokemon.types.includes(filterQuery.type)
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

// get single pokemon
router.get("/:id", (req,res,next) => {
  const { id } = req.params;
  try {
    let db = fs.readFileSync("db.json", "utf-8")   
    db = JSON.parse(db);
    const data = db.data;

    let currentIndex = data.findIndex((pokemon) => pokemon.id === parseInt(id));
   
    let totalIndex = data.length - 1;
   
    let prevIndex = currentIndex - 1;
    let nextIndex = currentIndex + 1;
    if (currentIndex === 0) {
      prevIndex = totalIndex;
    } else if ( currentIndex === totalIndex ) {
      nextIndex = 0;
    }
      
    const result = {
      previousPokemon: data[prevIndex],
      pokemon: data[currentIndex],
      nextPokemon: data[nextIndex],
    }
    console.log("re", result)
    
     res.send(result)
  } catch (error) {
    next(error)
  }
})


// add pokemon

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
    const {data} = db;

    const { id, name, types, imageLink } = req.body;
    if ((!id, !name || !types || !imageLink)) {
      error(`Missing body info`, 401);
    }

    if (
      data.find((pokemon) => pokemon.id === parseInt(id) || pokemon.name === name)) {
      error(`The Pokémon already exists`, 401);
    }

    if (types.length > 2) { error(`Pokémon can only have one or two types`, 401); }

    if ( !pokemonTypes.filter((pokemonType) => pokemonType !== types.join())
    ) {
      error(`Pokémon's type is invalid`, 401);
    }

    const newPokemon = { id: parseInt(id), name, types, imageLink };

    data.push(newPokemon);

    db = JSON.stringify(db);
    fs.writeFileSync("db.json", db);
    res.send(newPokemon);
  } catch (error) {
    next(error);
  }
});

// edit pokemon

router.put("/:id", (req,res,next) => {
  try {
    const allowUpdate = [ "name", "types", "imageLink" ];

    const { id } = req.params;

    const updates = req.body;
   
    const updateKeys = Object.keys(updates);
    
    const notAllow = updateKeys.filter((el) => !allowUpdate.includes(el));

    if (notAllow.length) {
      error(`Update field not allow`, 401)
    };

    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const data = db.data;
     
    const targetIndex = data.findIndex((pokemon) =>
      pokemon.id === parseInt(id));
    console.log("target", targetIndex);
    
    if (targetIndex < 0) {
      error(`Pokemon not found`, 401)
    }

    const updatedPokemon = {...data[targetIndex],...updates};
    db.data[targetIndex] = updatedPokemon;
   
    db.data = data;
    db = JSON.stringify(db);

    fs.writeFileSync("db.json", db);
    res.send(updatedPokemon);

  } catch (error) {
    next(error)
  }
})
//delete pokemon

router.delete("/:id", (req, res, next) => {
  try {

    const { id } = req.params;

    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const {data} = db;

    const targetIndex = data.find((pokemon) => {
      pokemon.id === parseInt(id);
    });

    if (targetIndex < 0) {
      error(`Pokemon not found`, 404);
    }

    db.data = data.filter((pokemon) => pokemon.id !== parseInt(id));
   
    db = JSON.stringify(db);
    fs.writeFileSync("db.json", db);
    res.send("ok");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
