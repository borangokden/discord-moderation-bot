const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = {
    name: "musicians",
    aliases: ["müzisyen"],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL()).setTimestamp().setColor("00f1ff")
        var member = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!"))
        if (!member) return message.channel.send(embed.setDescription("Öncelikle bir kullanıcı etiketle!"))
        await message.guild.members.cache.get(member.id).roles.add(config.roles.musiciansrole)
        message.channel.send(embed.setDescription(`${member} kullanıcısına başarıyla \`Müsizyen\` rolü verildi!`))
    }
}