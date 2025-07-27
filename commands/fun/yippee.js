const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yippee')
		.setDescription('Yippee'),
	async execute(interaction) {
		await interaction.reply('https://tenor.com/view/yippee-happy-celebration-joy-confetti-gif-25557730');
	},
};