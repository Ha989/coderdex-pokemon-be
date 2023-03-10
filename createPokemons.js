const fs = require('fs');
const csv = require('csvtojson');
// cấu hình lại
const createPokemons = async() => {
   let newData = await csv().fromFile("pokemon.csv");
   let data = JSON.parse(fs.readFileSync('db.json'));

   newData = Array.from(newData).slice(0,721);

   newData = newData.map((pokemon, index) => {
       return {
         id: index+1,
         name: pokemon.Name,
         types: pokemon.Type2 ? [pokemon.Type1.toLowerCase(), pokemon.Type2.toLowerCase()] : [pokemon.Type1.toLowerCase()],
         imageLink: `http://localhost:4000/images/${index+1}.png`
       }
   });
   
   data.data = newData;

   fs.writeFileSync("db.json", JSON.stringify(data));
}
createPokemons();