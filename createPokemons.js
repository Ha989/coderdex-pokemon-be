const fs = require('fs');
const csv = require('csvtojson');

const createPokemons = async() => {
   let newData = await csv().fromFile("pokemon.csv");
   let data = JSON.parse(fs.readFileSync('db.json'));

   newData = Array.from(newData).slice(0,721);

   newData = newData.map((pokemon, index) => {
       return {
         id: index+1,
         name: pokemon.Name,
         type: pokemon.Type2 ? [pokemon.Type1] : [pokemon.Type1, pokemon.Type2],
         imageLink: `http://localhost:4000/images/${index+1}.png`
       }
   });
   
   data.data = newData;

   fs.writeFileSync("db.json", JSON.stringify(data));
}
createPokemons();