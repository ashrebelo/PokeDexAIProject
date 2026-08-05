const express = require('express');
const Favorite = require('../models/Favorite');
const { getPokemonList, getPokemonByName } = require('../services/pokeapi');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const offset = Number.parseInt(req.query.offset, 10) || 0;
    const pokemonList = await getPokemonList({ limit, offset });

    const baseQuery = new URLSearchParams();
    if (limit) {
      baseQuery.set('limit', String(limit));
    }

    const nextOffset = pokemonList.next ? offset + limit : null;
    const previousOffset = offset - limit >= 0 ? offset - limit : null;

    res.render('index', {
      pokemonList,
      limit,
      offset,
      nextPageUrl: nextOffset === null ? null : `/?${new URLSearchParams({ limit: String(limit), offset: String(nextOffset) }).toString()}`,
      previousPageUrl: previousOffset === null ? null : `/?${new URLSearchParams({ limit: String(limit), offset: String(previousOffset) }).toString()}`,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/pokemon/:name', async (req, res, next) => {
  try {
    const pokemon = await getPokemonByName(req.params.name);
    let isFavorited = false;

    if (req.user) {
      isFavorited = Boolean(
        await Favorite.exists({
          userId: req.user._id,
          pokemonId: pokemon.id,
        })
      );
    }

    res.render('pokemon', { pokemon, isFavorited });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).render('pokemon', { pokemon: null, errorMessage: 'Pokemon not found.', isFavorited: false });
    }

    next(error);
  }
});

module.exports = router;