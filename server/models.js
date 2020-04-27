var Sequelize = require('sequelize');

var database = new Sequelize('database', 'user', 'password', {host: 'host'});

module.exports = function() {
	return {
		init: function() {
			this.User.hasOne(this.Profile, {foreignKey: 'spm_user_profile_id'});
			this.Profile.belongsTo(this.User);

			this.Game.hasMany(this.GamePrice, {as: 'Prices'});
			this.Game.hasMany(this.GameRelease, {as: 'Releases'});
			this.Game.hasMany(this.GameTag, {as: 'Tags'});

			this.Game.hasOne(this.GameGenre, {foreignKey: 'spm_game_genre_id'});
			this.GameGenre.belongsTo(this.Game);
		},

		User: database.define('User', {
			username	: Sequelize.STRING(20),
			password	: Sequelize.STRING(32),
			email		: Sequelize.STRING
		}, {timestamps: false, tableName: 'spm_user'}),

		Profile: database.define('Profile', {
			first_name		: Sequelize.STRING,
			last_name		: Sequelize.STRING,
			date_of_birth	: Sequelize.DATE,
			gender			: Sequelize.BOOLEAN,
			city			: Sequelize.STRING,
			state			: Sequelize.STRING,
			avatar			: Sequelize.STRING,
			status_msg		: Sequelize.STRING(100)
		}, {timestamps: false, tableName: 'spm_user_profile'}),

		Shelf: database.define('Shelf', {
			spm_game_id: Sequelize.INTEGER,
			spm_user_id: Sequelize.INTEGER
		}, {timestamps: false, tableName: 'spm_user_shelf'}),

		Game: database.define('Game', {
			name 				: Sequelize.STRING,
			description 		: Sequelize.TEXT,
			img_cover			: Sequelize.STRING,
			img_bg				: Sequelize.STRING,
			spm_game_genre_id	: Sequelize.INTEGER
		}, {timestamps: false, tableName: 'spm_game'}),

		GameRelease: database.define('GameRelease', {
			path 			: Sequelize.STRING,
			release 		: Sequelize.DATE,
			version 		: Sequelize.STRING(20),
			size 			: Sequelize.FLOAT,
			is_allowed 		: Sequelize.BOOLEAN
		}, {timestamps: false, tableName: 'spm_game_release'}),

		GamePrice: database.define('GamePrice', {
			price 			: Sequelize.FLOAT,
			discount 		: Sequelize.FLOAT,
			start 			: Sequelize.DATE,
			end 			: Sequelize.DATE
		}, {timestamps: false, tableName: 'spm_game_price'}),

		GameGenre: database.define('GameGenre', {
			name 			: Sequelize.STRING
		}, {timestamps: false, tableName: 'spm_game_genre'}),

		GameMedia: database.define('GameMedia', {
			path 			: Sequelize.STRING
		}, {timestamps: false, tableName: 'spm_game_media'}),

		GameTag: database.define('GameTag', {
			tag 			: Sequelize.STRING
		}, {timestamps: false, tableName: 'spm_game_tag'})
	};
}