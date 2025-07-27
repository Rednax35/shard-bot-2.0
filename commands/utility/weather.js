const { SlashCommandBuilder, InteractionContextType, time } = require('discord.js');
const axios = require('axios');
const { weatherAPI } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Gets the weather for a location')
		.addStringOption(option =>
			option
				.setName('town')
				.setDescription('Town (required!)')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('state')
				.setDescription('State (optional)'))
		.addStringOption(option =>
			option
				.setName('country')
				.setDescription('Country (optional, must be 2 letter (US))'))
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const town = interaction.options.getString('town');
		const state = interaction.options.getString('state');
		const country = interaction.options.getString('country');

		const geojson = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${town}&limit=5&appid=${weatherAPI}`);
		const geolocation = geojson.data;
		console.log(geolocation);
		lat = '';
		lon = '';

		for (location of geolocation) {
			console.log(location);
			if (state !== null && country !== null) {
				if (location['state'] === state && location['country'] === country) {
					lat = location['lat'];
					lon = location['lon'];
					break;
				}
			}
			else if (state !== null) {
				if (location['state'] === state) {
					lat = location['lat'];
					lon = location['lon'];
					break;
				}
			}
			else if (country !== null) {
				if (location['country'] === country) {
					lat = location['lat'];
					lon = location['lon'];
					break;
				}
			}
			else {
				lat = location['lat'];
				lon = location['lon'];
				break;
			}
		}
		console.log(`${lat}, ${lon}`);

		const the_weather = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,daily,minutely&appid=${weatherAPI}`);
		const info = the_weather.data;
		let weather = `In ${town}...\n`;

		weather = weather.concat(`The current temperature is: ${info['current']['temp']}\n`);
		weather = weather.concat(`The current humidity is: ${info['current']['humidity']}\n`);
		weather = weather.concat(`The current wind speed is: ${info['current']['wind_speed']}\n`);

		weather.concat('The current weather conditions are: \n');
		for (conditions of info['current']['weather']) {
			const subweather = conditions['main'];
			const description = conditions['description'];
			weather = weather.concat(`${subweather}, described as ${description}\n`);
		}

		await interaction.reply(weather);

		if ('alerts' in info) {
			let alert = 'Heads up, there\'s an alert in effect:\n';
			for (alerts of info['alerts']) {
				alert = alert.concat(`${alerts['sender_name']} has issued a ${alerts['event']}\n`);
				alert = alert.concat(`Alert starts at ${time(alerts['start'])} and ends at ${time(alerts['end'])}\n`);
			}
			await interaction.followUp(alert);
		}
	},
};