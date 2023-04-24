const Canvas = require("canvas");
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

var welcomeCanvas = {};
welcomeCanvas.create = Canvas.createCanvas(1024, 500);
welcomeCanvas.context = welcomeCanvas.create.getContext("2d");
welcomeCanvas.context.font = "72px sans-serif";
welcomeCanvas.context.fillStyle = "#ffffff";

Canvas.loadImage("./img/bg.png").then(async (img) => {
	welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);
	welcomeCanvas.context.fillText("Welcome", 360, 360);
	welcomeCanvas.context.beginPath();
	welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
	welcomeCanvas.context.stroke();
	welcomeCanvas.context.fill();
});

client.on("guildMemberAdd", async (member) => {
	await member.user.fetch(true);
	if (member.user.bot) return;
	const welcomeChannel = member.guild.channels.cache.get("1099912133413720205");
	if (!welcomeChannel || !welcomeChannel.isTextBased()) return;
	let canvas = welcomeCanvas;
	canvas.context.font = "42px sans-serif";
	canvas.context.textAlign = "center";
	canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
	canvas.context.font = "32px sans-serif";
	canvas.context.fillText(`You are our ${member.guild.memberCount}th member`, 512, 455);
	canvas.context.beginPath();
	canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
	canvas.context.closePath();
	canvas.context.clip();
	await Canvas.loadImage(member.user.avatarURL({ extension: "png", size: 1024 })).then((img) => {
		canvas.context.drawImage(img, 393, 47, 238, 238);
	});
	// write the buffer to a file
	// make a new discord attachment
	const attachment = new AttachmentBuilder(canvas.create.toBuffer(), "bg.png");
	try {
		welcomeChannel.send({ content: `:wave: Hello ${member}, Welcome to ${member.guild.name}`, files: [attachment] });
	} catch (error) {
		console.error(error);
	}
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	const prefix = "!";
	if (!message.content.startsWith(prefix) || message.mentions.members?.has(client.user.id)) return;

	const [command, ...args] = message.content.replace(prefix, "").split(/ /);
	if (command === "<@1099623542997389472>") {
		message.reply("Hey!");
	}
});

client.login("");
