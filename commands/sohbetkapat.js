
module.exports = {
    name: "kilitle",
    aliases: [],
    run: async (client, message, args) => {
        if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send(`Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı.`);
        let every = message.guild.roles.cache.find(r => r.name === "@everyone");
        message.channel.createOverwrite(every, {
          SEND_MESSAGES: false
        });
      
        message.channel.send("Kanal kilitlendi!");
    }

}