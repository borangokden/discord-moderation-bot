const Discord = require('discord.js')
const ms = require("ms");
const moment = require("moment")

module.exports = {
    name: "sürelirol",
    aliases: [],
    run: async (client, message, args) => {
        const embed1 = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setTimestamp()
        const embed2 = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setTimestamp()
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(embed1.setDescripton(`Bu Komutu Kullanabilmek İçin Mesajları Yönet Yetkisine Sahip Olmalısın!`))
        let user = message.mentions.users.first()
        let roles = message.mentions.roles.first()
        if (!args[0]) return message.channel.send(embed1.setDescription(`Öncelikle bir kullanıcı belirtmelisin.`))
        if (!user) return message.channel.send(embed1.setDescription(`**${args[0]}**, kişisi sunucuda bulunmamakta!`))
        if (!args[1]) return message.channel.send(embed1.setDescription(`Öncelikle bir rol etiketlemelisin.`))
        if (!roles) return message.channel.send(embed1.setDescription(`**${args[1]}**, rolü sunucuda bulunmamakta.`))
        if (!args[2]) return message.channel.send(embed1.setDescription(`Rolün ne kadar süre içerisinde kullanıcıda kalacağını belirtmelisin.`))
        let süre = args[2];
        message.guild.members.cache.get(user.id).roles.add(roles.id)
        message.channel.send(embed2.setDescription(`${user} isimli kişiye ${message.author.username} tarafından ${süre.replace(/d/, ' gün').replace(/s/, ' saniye').replace(/m/, ' dakika').replace(/h/, ' saat')} boyunca ${roles} rolü verildi!`)).then(mesaj => {
            setTimeout(async () => {
                message.guild.members.cache.get(user.id).roles.remove(roles.id)
                mesaj.edit(embed2.setDescription(`${roles}, için rol süresi doldu!`))
            }, ms(süre))
        })
    }
}