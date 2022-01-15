const Discord = require("discord.js");
const db = require("quick.db");
const config = require("../config.json")

module.exports = {
    name: 'isim',
    aliases: ['i'],
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed().setFooter("Developed By Jahky").setAuthor(message.author.username, message.author.avatarURL()).setTimestamp().setColor("00f1ff");
        var member = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        var name = args[1]
        var age = args[2]
        if (message.member.roles.cache.get(config.registration.stafd) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı"));
        if (!member) return message.channel.send(embed.setDescription("Öncelikle bir kullanıcıyı etiketle."));
        if (!name) return message.channel.send(embed.setDescription("Öncelikle kullanıcı için bir isim belirt."));
        if (!age) return message.channel.send(embed.setDescription("Öncelikle kullanıcı için bir yaş belirt."));

        db.push(`isimler_${member.id}`, ` \`${name} | ${age}\` ( isim değiştirme )`);
        message.guild.members.cache.get(member.id).setNickname(`${config.registration.GuildTag} ${name} | ${age}`);
        message.channel.send(embed.setDescription(`${member} kullanıcısının ismi başarıyla \`${name} | ${age}\` olarak değiştirildi!`));
    }
}