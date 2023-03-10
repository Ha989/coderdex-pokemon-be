# coderdex-pokemon-be

Backend API for Pokemons data. 
command: 

to install
```
npm install
```
to start
```
npm start
```
localhost
```
 http://localhost:4000
```

## Fetch list of Pokemon by ``GET`` name or type
 Query  
 ```
 search,  type, page, limit
 ```
## Fetch single Pokemon by GET pokemon id
 ```
 /pokemons/:id
 ```
 ## Add new Pokemon by POST
 ``` 
 name, imageLink, types, id 
 ```
 ## Update pokemon by PUT, update value ```name, imageLink, types```
 ``` 
 /pokemons/:id 
 ```
 ## Delete pokemon by DELETE
 ```
  /pokemons/:id
  ```
 
