const Discord = require("discord.js");
const db = require("quick.db")
const ms = require("ms");
const config = require("../config.json");
const moment = require("moment")

module.exports = {
    name: "süreliban",
    aliases: [],
    run: async (client, message, args) => {
        if(![config.bot.owner].includes(message.author.id) && message.guild.owner.id !== message.author.id) return
        let guild = message.guild
        let member = message.mentions.users.first();
        if (!member) return message.reply("Öncelikle banlanacak kullanıcıyı belirtmelisin.")
        let reason = args.slice(1).join(' ');
        let süre = args[2]
        if (reason.length < 1) return message.reply('Öncelikle geçerli bir sebep belirtmelisin.');
        if (!süre) return message.reply("Öncelikle süre belirtiniz.")
        message.guild.members.ban(member, 2)
        message.channel.send(`${member} kullanıcısı başarıyla süreli olarak banlandı!`)
        const embed = new Discord.MessageEmbed()
      .setColor("0x00AE86")
      .setTimestamp()
      .addField('Banlanan:', `${member.username}#${member.discriminator} (${member} - ${member.id})`)
      .addField('Banlayan:', `${message.author.username}#${message.author.discriminator} (${message.author} - ${message.author.id})`)
      .addField('Ban Sebebi', reason)
      .addField("Ban Tarihi", `${moment(Date.now()).format("LLL")}`)
    message.guild.channels.cache.get(config.penals.ban.log).send(embed)
    db.push(`sicil_${member.id}`, `${message.author} tarafından ${moment(Date.now()).format("LLL")} tarihinde ${reason} sebebiyle [ SURELI-BAN ] cezası almış.`)
          db.add(`points_${member}`, config.penals.points.banpoints);
        setTimeout(() => {
            message.guild.members.unban(member)
            message.channel.send(`${member} kullanıcısının banının süresi bittiği için banı açıldı!`)
        }, ms(süre))
    
    }
}