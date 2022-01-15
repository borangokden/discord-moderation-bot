const config = require("../config.json")
module.exports = {
    name: "ban-bilgi",
    aliases: ["bansor"],
    run: async (client, message, args) => {
        if (!message.member.hasPermission("BAN_MEMBERS") && message.member.roles.cache.has(config.penals.ban.staff)) return message.channel.send("Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!");

        let kullanici = args[0];

        if (!kullanici) return message.channel.send("Öncelikle bir kullanıcı ID girmen gerek!")

        message.guild.fetchBans()

            .then(bans => {

                if (!bans.has(kullanici)) {

                    return message.channel.send(`Bu kullanıcı banlanmamış.`)

                }

            })

        message.guild.fetchBan(kullanici).then(({ user, reason }) => {

            message.channel.send(`${user.tag} adlı kullanıcının ban sebebi: **${reason}**`)



        })

    }
}