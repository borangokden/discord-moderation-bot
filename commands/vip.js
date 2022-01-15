const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = {
    name: "vip",
    aliases: ["valuable", "very-important-person", "veryimportantperson"],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL()).setTimestamp().setColor("00f1ff")
        var member = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Ne yazık ki komutu kullanan kişide yetki yok"))
        if (!member) return message.channel.send(embed.setDescription("Lütfen bir kullanıcıyı etiketle."))
        await message.guild.members.cache.get(member.id).roles.add(config.roles.viprole)
        message.channel.send(embed.setDescription(`${member} kullanıcısına başarıyla \`Vip\` rolü verildi!`))
    }
}