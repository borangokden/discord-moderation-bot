const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const config = require("../config.json")

module.exports = {
    name: "forceban",
    aliases: ["kalıcıban"],
    run: async (client, message, args) => {
        let guild = message.guild
        let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("BoranGkdn YouTube").setColor("RANDOM").setTimestamp();
        if(![config.bot.owner].includes(message.author.id) && message.guild.owner.id !== message.author.id) return message.channel.send(embed.setDescription(`Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!`))
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send(embed.setDescription(`Öncelikle kalıcı banlanacak kullanıcıyı belirtmelisin!`))
    
        let reason = args.slice(1).join(' ')
    
        if (!reason) return message.channel.send(embed.setDescription(`Öncelikle geçerli bir sebep belirtmelisin!`))
        message.guild.members.ban(member.id, { reason: "Force Ban" })
        message.channel.send(embed.setDescription(`${member} - \`${member.id}\` kullanıcısı ${message.author} tarafından **${reason}** sebebiyle sunucudan banlandı!`))
        message.guild.channels.cache.get(config.penals.ban.log).send(embed.setImage("https://i.pinimg.com/originals/b2/84/33/b28433c392959f923ff0d736cd89dcbd.gif").setDescription(`${member} - \`${member.id}\` adlı kullanıcı ${message.author} tarafından **${reason}** sebebiyle sunucudan banlandı!`)  );
        member.send(embed.setImage("https://i.pinimg.com/originals/b2/84/33/b28433c392959f923ff0d736cd89dcbd.gif").setDescription(`${member.guild.name} sunucusundan ${message.author} tarafından **${reason}** sebebi ile banlandın!`));
        db.set(`ban.${member.id}`,true)
    }
}