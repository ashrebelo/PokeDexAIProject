const axios = require('axios');

const pokeApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

async function getPokemonList({ limit = 20, offset = 0 } = {}) {
  const response = await pokeApi.get('/pokemon', {
    params: { limit, offset },
  });

  return {
    count: response.data.count,
    next: response.data.next,
    previous: response.data.previous,
    results: response.data.results,
  };
}

async function getPokemonByName(name) {
  const pokemonName = String(name).trim().toLowerCase();
  const response = await pokeApi.get(`/pokemon/${pokemonName}`);
  const pokemon = response.data;

  return {
    id: pokemon.id,
    name: pokemon.name,
    sprites: pokemon.sprites,
    types: pokemon.types,
    height: pokemon.height,
    weight: pokemon.weight,
    stats: pokemon.stats,
  };
}

module.exports = {
  getPokemonList,
  getPokemonByName,
};
