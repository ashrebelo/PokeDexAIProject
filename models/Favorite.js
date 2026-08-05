const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		pokemonId: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		spriteUrl: {
			type: String,
			default: '',
		},
		types: {
			type: [String],
			default: [],
		},
		height: {
			type: Number,
			default: null,
		},
		weight: {
			type: Number,
			default: null,
		},
		stats: {
			type: [
				{
					name: String,
					value: Number,
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

favoriteSchema.index({ userId: 1, pokemonId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
