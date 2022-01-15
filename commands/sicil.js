const Discord = require("discord.js");
const config = require("../config.json");
const db = require("quick.db");

module.exports = {
    name: "sicil",
    aliases: ["sicil"],
    run: async (client, message, args) => {
      if (!message.member.roles.cache.has(config.penals.ban.staff) && !message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!")
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      const points = db.fetch(`points_${member}`) || 0
        if (!member) return message.channel.send("Öncelikle siciline bakacağın kullanıcıyı belirtmelisin.")
        let penals = db.get(`sicil_${member.user.id}`);
        if (!penals) return message.channel.send(`${member} kullanıcısının sicil verisi bulunmamaktadır!`)
        const embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(`Kullanıcısının sicili:`)
        .setDescription(penals.map((data) => `${data}`).join("\n"))
        .addField("Toplam ceza puanı:", points)
        message.channel.send(embed)
    }
}