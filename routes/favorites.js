const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const Favorite = require('../models/Favorite');
const { getPokemonByName } = require('../services/pokeapi');

const router = express.Router();

function normalizeFavorite(pokemon) {
	return {
		pokemonId: pokemon.id,
		name: pokemon.name,
		spriteUrl: pokemon.sprites?.front_default || pokemon.sprites?.other?.['official-artwork']?.front_default || '',
		types: pokemon.types.map((typeEntry) => typeEntry.type.name),
		height: pokemon.height,
		weight: pokemon.weight,
		stats: pokemon.stats.map((statEntry) => ({
			name: statEntry.stat.name,
			value: statEntry.base_stat,
		})),
	};
}

router.use(ensureAuthenticated);

router.get('/', async (req, res, next) => {
	try {
		const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();

		res.render('favorites/index', {
			favorites,
		});
	} catch (error) {
		next(error);
	}
});

router.post('/:name', async (req, res, next) => {
	try {
		const pokemon = await getPokemonByName(req.params.name);
		const favoriteData = normalizeFavorite(pokemon);

		await Favorite.findOneAndUpdate(
			{ userId: req.user._id, pokemonId: favoriteData.pokemonId },
			{
				$set: {
					...favoriteData,
					userId: req.user._id,
				},
			},
			{
				upsert: true,
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		res.redirect(`/pokemon/${pokemon.name}`);
	} catch (error) {
		next(error);
	}
});

router.post('/:name/remove', async (req, res, next) => {
	try {
		const pokemonName = String(req.params.name).trim().toLowerCase();

		await Favorite.deleteOne({
			userId: req.user._id,
			name: pokemonName,
		});

		res.redirect(req.get('referer') || '/favorites');
	} catch (error) {
		next(error);
	}
});

module.exports = router;
