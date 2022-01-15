const Discord = require('discord.js');
const db = require('quick.db');
const config = require("../config.json");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  name: "unmute",
  aliases: [],
  run: async (client, message, args) => {
    if (!message.member.roles.cache.has(config.penals.mute.staff) && !message.member.hasPermission("ADMİNİSTRATOR")) {
      return message.channel.send("Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!");
    }
    let member = message.member
    let guild = message.guild
    let user = message.mentions.users.first();
    let nick = await db.get(`muteisim.${user.id}`)
    if (!user) return message.reply('Öncelikle susturulması kaldırılacak kullanıcıyı belirtmelisin!');
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!");
    user.roles.remove(config.penals.mute.roles);
    message.channel.send(`${member} kullanıcısının susturulması başarıyla ${message.author} tarafından kaldırıldı!`)

    user.setNickname(nick)

    const embed = new Discord.MessageEmbed()
      .setColor("0x00AE86")
      .setTimestamp()
      .addField('Mutesi kalkan:', `${user.username}#${user.discriminator} (${user} - ${user.id})`)
      .addField('Yetkili:', `${message.author.username}#${message.author.discriminator} (${message.author} - ${message.author.id})`)
      .addField("Kalkma Tarihi", `${moment(Date.now()).format("LLL")}`)
    message.guild.channels.cache.get(config.penals.mute.log).send(embed);
  }
};