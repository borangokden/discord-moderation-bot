module.exports = {
    name: "sil",
    aliases: ["temizle"],
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı!");
        if (!args[0]) return message.channel.send("Öncelikle 1-100 arasında bir rakam belirtiniz.");
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`**${args[0]}** adet mesaj silindi!`)
        })
    }
}