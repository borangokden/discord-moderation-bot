const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "afk",
    aliases: ["afk"],
    run: async (client, message, args) => {
        let embed = new Discord.MessageEmbed().setFooter(`BoranGkdn was here!`)
        if (message.member.displayName.startsWith("[AFK]")) return;
        let uye = message.guild.members.cache.get(message.author.id);
        let reason = args.join(' ') || "Sebep belirtilmedi!";
        let nick = uye.displayName;
        db.set(`sebep_${message.author.id}_${message.guild.id}`, reason);
        db.set(`user_${message.author.id}_${message.guild.id}`, message.author.id);
        db.set(`afktime_${message.guild.id}`, Date.now());
        db.set(`nick_${message.author.id}_${message.guild.id}`, nick);
        let sebep = db.fetch(`sebep_${message.author.id}_${message.guild.id}`);
        message.member.setNickname(`[AFK] ` + nick);
        message.reply(embed.setDescription(`${message.author} başarıyla **${sebep}** sebebiyle afk moduna giriş yaptınız.`).setColor('RANDOM'))
    }
}