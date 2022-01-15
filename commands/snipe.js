const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment")
require('moment-duration-format');

module.exports = {
    name: "snipe",
    aliases: ["snipe"],
    run: async (client, message, args) => {
        let hembed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('RED')
        let embed = new MessageEmbed().setColor('#2F3136')
        let mesaj = db.get(`snipe.${message.guild.id}.${message.channel.id}`);
        if (!mesaj) {
            message.delete({ timeout: 5000 })
            return message.channel.send(hembed.setDescription(`Bu kanalda silinmiş bir mesaj bulunmamakta!`)).then(msg => msg.delete({ timeout: 5000 }))
        }

        if (mesaj.icerik.toLowerCase().includes('discord.gg/') || mesaj.icerik.toLowerCase().includes('https') || mesaj.icerik.toLowerCase().includes('http') || mesaj.icerik.toLowerCase().includes('.com')) {
            message.delete({ timeout: 5000 })
            return message.channel.send(hembed.setDescription(`Son silinen mesajda reklam bulunmakta!`)).then(msg => msg.delete({ timeout: 5000 }))
        }


        let mesajYazari = await message.guild.members.cache.get(mesaj.yazar);
        if (mesaj.icerik) {
            return message.channel.send(embed.setDescription(`
        Mesaj sahibi: ${mesajYazari ? mesajYazari : mesajYazari.tag} ( \`${mesajYazari.id}\` )
        Mesajın yazılma tarihi: \`${moment.duration(Date.now() - mesaj.yazilmaTarihi).format("D [gün], H [saat], m [dakika], s [saniye]")}\` önce
        Mesajın silinme tarihi: \`${moment.duration(Date.now() - mesaj.silinmeTarihi).format("D [gün], H [saat], m [dakika], s [saniye]")}\` önce 
        
        Mesaj İçeriği: \`${mesaj.dosya ? "Atılan mesaj bir dosya içeriyor." : mesaj.icerik}\`
        `))
        }
    }
}