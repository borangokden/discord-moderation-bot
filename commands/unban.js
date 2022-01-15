const Discord = require("discord.js");
const moment = require("moment");
const config = require("../config.json")
module.exports = {
    name: "unban",
    aliases: ["banremove"],
    run: async (client, message, args) => {
        const permError = new Discord.MessageEmbed()
        .setColor('#ed455a')
          .setTitle('Hata')
            .setDescription('Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!')
      const userError = new Discord.MessageEmbed()
        .setColor('#ed455a')
          .setTitle('Hata')
            .setDescription('Öncelikle bir ID belirtmelisiniz!')
      const userError2 = new Discord.MessageEmbed()
        .setColor('#ed455a')
          .setTitle('Hata')
            .setDescription("Herhangi bir ID'de harf kullanılamaz")
      const userError3 = new Discord.MessageEmbed()
        .setColor('#ed455a')
          .setTitle('Hata')
            .setDescription('Belirttiğiniz kullanıcı yasaklanmamış!')
      const levelError = new Discord.MessageEmbed()
        .setColor('#ed455a')
          .setTitle('Hata')
            .setDescription('Sizinle aynı veya daha yüksek bir role sahip bir üyenin yasağını kaldırmazsınız')
      if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send
            (permError)
      let user = args[0];
        if  (!user) return message.channel.send
              (userError).catch(console.error)
      if  (isNaN(args[0])) return message.channel.send
            (userError2).catch(console.error)
      if  (user.highestRole >= message.author.highestRole) return message.channel.send
              (levelError)
      const banList = await message.guild.fetchBans();
      if (!user.id === banList) return message.channel.send
          (userError3)
      
      message.guild.members.unban(user);
    message.channel.send(`<@!${user}> kullanıcısının yasağı ${message.author} tarafından başarıyla kaldırıldı!`)
    const embed = new Discord.MessageEmbed()
      .setColor("0x00AE86")
      .setTimestamp()
      .addField('Banı kaldırılan üye:', `${user.tag} (<@!${user.id}> - ${user.id})`)
      .addField('Yetkili:', `${message.author.username}#${message.author.discriminator} (${message.author} - ${message.author.id})`)
      .addField("Tarih", `${moment(Date.now()).format("LLL")}`)
    message.guild.channels.cache.get(config.penals.ban.log).send(embed);
    }
}