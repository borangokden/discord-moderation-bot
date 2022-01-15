module.exports = {
    name: "nerede",
    aliases: ["ss", "n"],
    run: async (client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!user) return message.channel.send("Öncelikle bir kullanıcı etiketle!")

        let sonuc; if (!user.voice.channelID) sonuc = `**${user.displayName}** kullanıcısı herhangi bir ses kanalında değil.`; if (user.voice.channelID) sonuc = `${user.displayName} kullanıcısı \`${user.voice.channel.name}\` isimli sesli odaya bağlı! Ses kanalı: <#${user.voice.channel.id}>`

        message.channel.send(sonuc)
    }
}