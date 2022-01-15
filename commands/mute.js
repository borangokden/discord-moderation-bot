const Discord = require('discord.js');
const db = require('quick.db');
const config = require("../config.json");
const limit = new Map();
const moment = require("moment");
moment.locale("tr");
const ms = require("ms")

module.exports = {
  name: "mute",
  aliases: ["mute"],
  run: async (client, message, args) => {
    if (!message.member.roles.cache.has(config.penals.mute.staff) && !message.member.hasPermission("ADMİNİSTRATOR")) {
      return message.channel.send("Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!");
    }
    let guild = message.guild
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.slice(1).join(' ');
    if (!member) return message.reply('Öncelikle susturulacak kullanıcıyı belirtmelisin.');
      let sure = args[2];
        if (!sure) return message.reply("Öncelikle süre belirtiniz.")
    
    if (reason.length < 1) return message.reply('Öncelikle geçerli bir sebep belirtmelisin.');
    if (config.penals.mute.limit > 0 && limit.has(message.author.id) && limit.get(message.author.id) == config.penals.mute.limit) return message.channel.send("Saatlik mute sınırına ulaştın!");
    if (!message.member.hasPermission(8) && member && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("Kendinle aynı yetkide ya da daha yetkili olan birini muteleyemezsin!");
    db.set(`muteisim.${member.id}`, member.displayName)
    message.channel.send(`**${member}** kullanıcısı ${message.author} tarafından başarıyla susturuldu!`)
    member.roles.add(config.penals.mute.roles)

    const embed = new Discord.MessageEmbed()
      .setColor("0x00AE86")
      .setTimestamp()
      .addField('Mutelenen:', `${member.tag} (${member} - ${member.id})`)
      .addField('Muteleyen:', `${message.author.username}#${message.author.discriminator} (${message.author} - ${message.author.id})`)
      .addField('Mute sebebi', reason)
      .addField("Mute Tarihi", `${moment(Date.now()).format("LLL")}`)
    message.guild.channels.cache.get(config.penals.mute.log).send(embed);
    db.push(`sicil_${member.id}`, `${message.author} tarafından ${moment(Date.now()).format("LLL")} tarihinde ${reason} sebebiyle **[ MUTE ]** cezası almış.`)
    db.add(`points_${member}`, config.penals.points.mutepoints);
    if (config.penals.mute.limit > 0) {
      if (!limit.has(message.author.id)) limit.set(message.author.id, 1);
      else limit.set(message.author.id, limit.get(message.author.id) + 1);
      setTimeout(() => {
        if (limit.has(message.author.id)) limit.delete(message.author.id);
      }, 1000 * 60 * 60)
              setTimeout(() => {
            member.roles.remove(config.penals.mute.roles)
            message.channel.send(`${member} kullanıcısının mute süresi bittiği için mutesi açıldı!`)
                message.guild.channels.cache.get(config.penals.mute.log).send(`${member} kullanıcısının mute süresi bittiği için mutesi açıldı!`)
        }, ms(sure))
    };
  }
};