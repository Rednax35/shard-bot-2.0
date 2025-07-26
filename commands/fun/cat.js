const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Sends a cat photo')
		.addStringOption(option =>
			option
				.setName('cat')
				.setDescription('Cat to get photo of')
				.setRequired(true)
				.addChoices(
					{ name: 'Stormy', value: 'stormy' },
					{ name: 'Peanut', value: 'peanut' },
					{ name: 'Kirby', value: 'kirby' },
					{ name: 'Baby Kitty', value: 'babykitty' },
					{ name: 'Miss Biscuit', value: 'cheddar' },
					{ name: 'Betty', value: 'betty' },
					{ name: 'Hawkins', value: 'hawkins' },
					{ name: 'Lucky', value: 'lucky' },
					{ name: 'Shadow', value: 'shadow' },
					{ name: 'Bip', value: 'bip' },
					{ name: 'Helena', value: 'helena' },
					{ name: 'Foster Kitten', value: 'fosters' },
					{ name: 'Eileen', value: 'eileen' },
					{ name: 'Random', value: 'random' },
				))
		.setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		let cat = interaction.options.getString('cat');
		directory = fs.readdirSync('./images/');
		if (cat === 'random') {
			random_index = Math.floor(Math.random() * directory.length);
			cat = directory[random_index];
		}
		const images = fs.readdirSync(`./images/${cat}/`);
		const upload = images[Math.floor(Math.random() * images.length)];

		await interaction.reply('Sending a cat photo...');


		const file = new AttachmentBuilder(`./images/${cat}/${upload}`);
		const catEmbed = new EmbedBuilder()
			.setTitle('Kitty')
			.setImage(`attachment://${upload}`);

		await interaction.followUp({ embeds: [catEmbed], files: [file] });
	},
};