const Discord = require('discord.js');
const db = require('quick.db');
const config = require("../config.json");
const limit = new Map();
const moment = require("moment");
moment.locale("tr");

module.exports = {
  name: "ban",
  aliases: ["yargı"],
  run: async (client, message, args) => {
    if (!message.member.roles.cache.has(config.penals.ban.staff) && !message.member.hasPermission("BAN_MEMBERS")) {
      return message.channel.send("Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!");
    }

    let member = message.member
    let guild = message.guild
    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    let reason = args.slice(1).join(' ');
    if (!user) return message.reply('Öncelikle banlanacak kullanıcıyı belirtmelisin.');
    if (reason.length < 1) return message.reply('Öncelikle geçerli bir sebep belirtmelisin.');

    if (!message.guild.member(user).bannable) return message.reply('Yetkili kişiler banlanamaz.');
    if (config.penals.ban.limit > 0 && limit.has(message.author.id) && limit.get(message.author.id) == config.penals.ban.limit) return message.channel.send("Saatlik ban sınırına ulaştın!");
    if (!message.member.hasPermission(8) && member && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!");
    message.guild.members.ban(user);
    message.channel.send(`**${user.username}** kullanıcısı ${message.author} tarafından sunucudan banlanmıştır!`)

    const embed = new Discord.MessageEmbed()
      .setColor("0x00AE86")
      .setTimestamp()
      .addField('Banlanan:', `${user.username}#${user.discriminator} (${user} - ${user.id})`)
      .addField('Banlayan:', `${message.author.username}#${message.author.discriminator} (${message.author} - ${message.author.id})`)
      .addField('Ban Sebebi', reason)
      .addField("Ban Tarihi", `${moment(Date.now()).format("LLL")}`)
    message.guild.channels.cache.get(config.penals.ban.log).send(embed);
    db.push(`sicil_${user.id}`, `${message.author} Tarafından ${moment(Date.now()).format("LLL")} tarihinde ${reason} sebebiyle **[ BAN ]** cezası almış.`)
    db.add(`points_${member}`, config.penals.points.banpoints);
    if (config.penals.ban.limit > 0) {
      if (!limit.has(message.author.id)) limit.set(message.author.id, 1);
      else limit.set(message.author.id, limit.get(message.author.id) + 1);
      setTimeout(() => {
        if (limit.has(message.author.id)) limit.delete(message.author.id);
      }, 1000 * 60 * 60)
    };
  }
};