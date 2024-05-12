const express = require("express");
const app = express();
const port = 3000;

// ejs
app.set("view engine", "ejs");
// accept data sent by a <form>
app.use(express.urlencoded({ extended: true }))

// data source
let POKEMON_LIST = [
 {
   name: "Bulbasaur",
   pokedexId: 1,
   type: "Poison",
   description:
     "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
   image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
 },
 {
   name: "Charmander",
   pokedexId: 4,
   type: "Fire",
   description:
     "The flame at the tip of its tail makes a sound as it burns. You can only hear it in quiet places.",
   image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
 },
 {
   name: "Squirtle",
   pokedexId: 7,
   type: "Water",
   description:
     "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
   image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
 }, 
];

// by default the team is empty
const TEAM = []

app.post("/add/:idToAdd", (req, res)=>{
  console.log(`DEBUG: Request received to add to team: ${JSON.stringify(req.params)}`)

  // give the id of the pokemon you want to add

  // search for that pokemon (find the pokemon object)
  let matchingPokemon = null
  for (let poke of POKEMON_LIST) {
    if (poke.pokedexId === parseInt(req.params.idToAdd)) {
      matchingPokemon = poke
      break
    }
  }

  // handle search results
  if (matchingPokemon === null) {
    return res.send(`ERROR: Could not find pokemon with id: ${req.params.idToAdd} `)
  }

  // add it to the team
  TEAM.push(matchingPokemon)

  return res.send(`Who is on the team: ${JSON.stringify(TEAM)}`)
})


// endpoints (routes)
app.get("/", (req, res) => {  
    return res.render("all.ejs",
      {myPokemonList:POKEMON_LIST,
       pageTitle:"All Pokemon",
       showButtons:true
      })
});
// show the add pokemon page
app.get("/show-add-page", (req,res)=>{
    return res.render("add.ejs")
})
// post endpoint that inserts pokemon into the pokemon list
app.post("/insert-pokemon", (req, res) => {
    console.log("POST REQUEST received at /insert-pokemon")    
    console.log(req.body)

    const pokemonToAdd = {
        name: req.body.tbName,
        pokedexId: parseInt(req.body.tbId),
        type: req.body.selType,
        description: req.body.tbDesc,       
        image: req.body.tbImage,
    }

    POKEMON_LIST.push(pokemonToAdd)

    // TODO: Update to send the user back to the / endpoint
    return res.redirect("/")
    
})

// delete all pokemon
app.post("/delete-all", (req,res)=>{
  console.log("Request received at /delete-all endpoint")  
  POKEMON_LIST = [] 
  
  // send the user back to the / endpoint so that
  // they can see the results
  return res.redirect("/")
})

// reset all pokemon to default value
app.post("/reset-all", (req,res)=>{
  POKEMON_LIST = [
    {
      name: "Bulbasaur",
      pokedexId: 1,
      type: "Poison",
      description:
        "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
      image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
    },
    {
      name: "Charmander",
      pokedexId: 4,
      type: "Fire",
      description:
        "The flame at the tip of its tail makes a sound as it burns. You can only hear it in quiet places.",
      image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
    },
    {
      name: "Squirtle",
      pokedexId: 7,
      type: "Water",
      description:
        "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
      image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
    }, 
   ]
   return res.redirect("/")
})

// TODO: Endpoint to delete one pokemon
app.post("/delete-one/:idToDelete", (req, res) => {
  console.log("REQUEST received at delete-one endpoint")
  console.log("Url parameters")
  console.log(req.params)

  // search for the pokemon with the specified id
  let pos = -1
  for (let i = 0; i < POKEMON_LIST.length; i++) {
    if (POKEMON_LIST[i].pokedexId === parseInt(req.params.idToDelete)) {
      pos = i
      break
    }
  }

  if (pos === -1) {
    return res.send(`ERROR: Cannot find this pokemon ${req.params.idToDelete}`)    
  }
  
  // delete them from the list
  POKEMON_LIST.splice(pos,1)
  // return the user back to the / endpoint
  return res.redirect("/")
})


// TODO: Endpoint to add one pokemon to a team

// TODO: Endpoint to show a team
app.get("/show-team", (req,res)=>{
  // reuse the all.ejs template, but show the pokemon on your team
  // instead of showing all pokemon
  return res.render("all.ejs", 
      { myPokemonList:TEAM, 
        pageTitle:"My Team",
        showButtons:false
      })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);  
});
