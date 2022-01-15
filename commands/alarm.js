const Discord = require('discord.js');
const ms = require('ms');
const config = require("../config.json")
const prefix = config.bot.prefix
module.exports = {
    name: "alarm",
    aliases: ["hatırlatıcı"],
    run: async (client, message, args) => {
        let süre = args[0]

        if (!süre) return message.channel.send(`${prefix}alarm <1h,1m,1s> <hatırlatacağım şey>`)

        let alarm = args.slice(1).join(' ')

        if (!alarm) return message.channel.send(`${prefix}alarm <1h,1m,1s> <hatırlatacağım şey>`)

        message.channel.send(`Alarm kuruldu **${süre}** sonra size bildireceğim.`)

        setTimeout(() => {

            message.channel.send(`<@${message.author.id}>, Hatırlatmamı istediğin şeyin zamanı geldi!\n**${alarm}**`);
            message.author.send(`<@${message.author.id}>, Hatırlatmamı istediğin şeyin zamanı geldi!\n**${alarm}**`)

        }, ms(süre));
    }
}