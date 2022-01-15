const { Client, MessageEmbed, Collection } = require("discord.js");
const Discord = require("discord.js");
const client = new Client
const fs = require("fs");
const config = require("./config.json");
const db = require("quick.db");
const moment = require('moment');
const ms = require("ms")
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();

client.on("ready", () => {
    client.user.setPresence({activity: {name: (config.bot.botdurum)}, status: "online"})
    client.channels.cache.get(config.channels.voicechannel).join()
})

fs.readdirSync('./commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./commands/${files}`);
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})

client.on('message', message => {
    if (!message.guild || message.author.bot || !message.content.startsWith(config.bot.prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return;
    cmd.run(client, message, args)
})

client.on("guildBanRemove", function (guild, user) {
    if (db.get(`ban.${user.id}`) === true) guild.members.ban(user.id, { reason: "Açılmaz banke." })
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (!oldState.channelID && newState.channelID) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanala girdi!`);
    if (oldState.channelID && !newState.channelID) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(oldState.channelID).name}\` adlı sesli kanaldan ayrıldı!`);
    if (oldState.channelID && newState.channelID && oldState.channelID != newState.channelID) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi ses kanalını değiştirdi! (\`${newState.guild.channels.cache.get(oldState.channelID).name}\` - \`${newState.guild.channels.cache.get(newState.channelID).name}\`)`);
    if (oldState.channelID && oldState.selfMute && !newState.selfMute) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendi susturmasını kaldırdı!`);
    if (oldState.channelID && !oldState.selfMute && newState.selfMute) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendini susturdu!`);
    if (oldState.channelID && oldState.selfDeaf && !newState.selfDeaf) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendi sağırlaştırmasını kaldırdı!`);
    if (oldState.channelID && !oldState.selfDeaf && newState.selfDeaf) return newState.guild.channels.cache.get(config.logs.voicelog).send(`${newState.guild.members.cache.get(newState.id).displayName} üyesi \`${newState.guild.channels.cache.get(newState.channelID).name}\` adlı sesli kanalda kendini sağırlaştırdı!`);
});

client.on('messageDelete', (message) => {
    if (!message.guild || message.author.bot) return;
    const embed = new Discord.MessageEmbed()
        .setAuthor("Mesaj Silindi", message.author.avatarURL({ dynamic: true }))
        .addField("🔹 **Mesaj Sahibi**", `${message.author.tag}`, true)
        .addField("🔹 **Mesaj Kanalı**", `${message.channel}`, true)
        .addField("🔹 **Mesaj Silinme Tarihi**", `**${moment().format('LLL')}**`, true)
        .setDescription(`🔹 **Silinen mesaj:** \`${message.content.replace("`", "")}\``)
        .setTimestamp()
        .setColor("#00a3aa")
        .setFooter("Mesaj silindiği saat:")
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
    client.channels.cache.get(config.logs.messagelog).send(embed)
})

client.on("messageDelete", async (message) => {
    if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
    let snipe = {
        mesaj: message.content,
        mesajyazan: message.author.id,
        ytarihi: message.createdTimestamp,
        starihi: Date.now(),
        kanal: message.channel.id
    }
    await db.set(`snipe.${message.guild.id}`, snipe)
});

client.on("message", message => {
    let embed = new MessageEmbed()
        .setFooter(`BoranGkdn was here!`)
    if (!message.guild) return;
    if (message.content.includes(`afk`)) return;
    let etiket = message.mentions.users.first()
    let uye = db.fetch(`user_${message.author.id}_${message.guild.id}`)
    let nickk = db.fetch(`nick_${message.author.id}_${message.guild.id}`)
    if (etiket) {
        let reason = db.fetch(`sebep_${etiket.id}_${message.guild.id}`)
        let uye2 = db.fetch(`user_${etiket.id}_${message.guild.id}`)
        if (message.content.includes(uye2)) {
            let time = db.fetch(`afktime_${message.guild.id}`);
            let timeObj = ms(Date.now() - time);
            message.channel.send(embed.setDescription(`${etiket} adlı kullanıcı **${reason}** sebebiyle \`${timeObj}\` süresi boyunca afk.`).setColor("#2F3136"))
        }
    }
    if (message.author.id === uye) {
        message.member.setNickname(nickk)
        db.delete(`sebep_${message.author.id}_${message.guild.id}`)
        db.delete(`user_${message.author.id}_${message.guild.id}`)
        db.delete(`nick_${message.author.id}_${message.guild.id}`)
        db.delete(`user_${message.author.id}_${message.guild.id}`);
        db.delete(`afktime_${message.guild.id}`)
        message.reply(`Başarıyla \`AFK\` modundan çıkış yaptın.`)
    }
})

client.on("messageDelete", async message => {
    if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
    await db.set(`snipe.${message.guild.id}.${message.channel.id}`, { yazar: message.author.id, yazilmaTarihi: message.createdTimestamp, silinmeTarihi: Date.now(), dosya: message.attachments.first() ? true : false });
    if (message.content) db.set(`snipe.${message.guild.id}.${message.channel.id}.icerik`, message.content);
});

client.on('guildMemberAdd', (member) => {
    if (member.user.bot) return;
    db.add(`girişçıkış.${member.id}`, 1);
    if (db.get(`girişçıkış.${member.id}`) >= 3) {//3 defa çık gir yaparsa
        member.guild.members.ban(member.id, { reason: `Sunucudan kısa sürede çok fazla gir çık yapmak.` })
        client.channels.cache.get(config.penals.ban.log).send(`${member} adlı kullanıcı sunucuya kısa süre içinde defalarca çık gir yaptığı için sunucudan banlandı!`)
member.send("Sunucuya kısa süre içinde defalarca çık gir yaptığın için sunucudan banlandın!")
    }
});
setInterval(() => {
    db.all().filter(data => data.ID.endsWith("girişçıkış")).forEach(data => {
        db.delete(data.ID)
    })
}, 60 * 1000 * 5)

const iltifatlar = [
    "Çok güzelsin.",
    "İLTİFAT YAZ BURAYA",
    "İLTİFAT YAZ BURAYA",
    "bu şekilde yapabilirsiniz",
    "bu şekilde yapabilirsiniz",
    "BGXD"
];
// İLTİFATLARI BU ŞEKİLDE İSTEDİĞİNİZ KADAR ÇOĞALTABİLİRSİNİZ
var iltifatSayi = 0; // Buraya ellemeyin!
client.on("message", async message => {
    if (message.channel.id !== config.channels.chat || message.author.bot) return;
    iltifatSayi++
    if (iltifatSayi >= 50) { // 50 yazan yer, 50 mesajda bir iltifat edeceğini gösterir, değiştirebilirsiniz.
        iltifatSayi = 0;
        const random = Math.floor(Math.random() * ((iltifatlar).length - 1) + 1);
        message.reply(`**${(iltifatlar)[random]}**`);
    };
});

client.login(process.env.token).then(x => console.log(`[BORANGKDN-BOT] ${client.user.username} Olarak giriş yaptı`)).catch(err => console.log(`[BORANGKDN-BOT] Giriş yapamadı sebep: ${err}`))

client.on("userUpdate", async function(oldUser, newUser) { // BoranGkdn 
    const guildID = (config.bot.GuildID)
    const roleID = (config.roles.familyrole)
    const tag = (config.registration.GuildTag)
    const chat = (config.channels.chat)
    const log2 = (config.logs.TagLog) 
  
    const guild = client.guilds.cache.get(guildID)
    const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
    const member = guild.members.cache.get(newUser.id)
    const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('#e4b400').setTimestamp().setFooter('BoranGkdn was here!');
    if (newUser.username !== oldUser.username) {
        if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
            member.roles.remove(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(`${newUser} isminden tagımızı çıkartarak ailemizden ayrıldı!`))
        } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
            member.roles.add(roleID)
            client.channels.cache.get(chat).send(`**Tebrikler, ${newUser} tag alarak ailemize katıldı!**`)
            client.channels.cache.get(log2).send(embed.setDescription(`${newUser} ismine tagımızı alarak ailemize katıldı`))
        }
    }
  
  })

client.on('guildMemberRemove' , member => {
      db.set(`roles_${member.id}`, member.roles.cache.map(x => x.id))
        db.set(`isim_${member.id}`, member.displayName)
})

client.on('guildMemberAdd', (member) => {
    const role = db.fetch(`roles_${member.id}`)
    if (!role) return
  member.roles.set(role)
});

client.on('guildMemberAdd', (member) => {
    const name = db.fetch(`isim_${member.id}`)
    if (!name) return
  member.setNickname(name)
});

    //------------------------------------------------------------------------------------------------------------\\