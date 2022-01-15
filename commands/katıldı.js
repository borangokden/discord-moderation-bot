const { MessageEmbed, ShardingManager } = require('discord.js')
const data = require('quick.db')
const config = require("../config.json")
module.exports = {
    name: "katıldı",
    aliases: ["toplantı"],
    run: async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new MessageEmbed().setDescription(`Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!`).setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true })))
        let members = message.guild.members.cache.filter(member => member.roles.cache.has(config.meeting.katıldı) && member.voice.channelID != config.meeting.meetingchannel);
        members.array().forEach((member, index) => { setTimeout(() => { member.roles.remove(config.meeting.katıldı).catch(); }, index * 1250) });
        let verildi = message.member.voice.channel.members.filter(member => !member.roles.cache.has(config.meeting.katıldı) && !member.user.bot)
        verildi.array().forEach((member, index) => { setTimeout(() => { member.roles.add(config.meeting.katıldı).catch(); }, index * 1250) });
        message.channel.send(new MessageEmbed().setDescription(`<@&${config.meeting.katıldı}> rolü <#${config.meeting.meetingchannel}> kanalında bulunan üyelere dağıtılmaya başlandı.\n\n toplam rol verilen kullanıcı: \n \`${verildi.size}\` \n\n rolleri geri alınan kullanıcı sayısı: \n \`${members.size}\``).setTitle(`Toplantı yoklaması alındı!`).setThumbnail(message.guild.iconURL({ dynamic: true })))
    }
}