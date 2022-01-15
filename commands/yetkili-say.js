const config = require("../config.json")
module.exports = {
    name: "yetkili-say",
    aliases: ["ysay"],
    run: async (client, message, args) => {
      if(message.member.hasPermission('ADMINISTRATOR')) {
            let qqq = args[0];
            if(!qqq) return message.channel.send(`Bir veri belirtiniz. \`${config.bot.prefix}ysay dm/etiket\` `).catch(e => { })
        
            if(qqq == "etiket"){
            let sesdedeğil = message.guild.members.cache.filter(x => x.roles.cache.has(config.meeting.yetkili)).filter(y => !y.voice.channel&& y.presence.status!="offline")
        message.channel.send(`
        Aktif olup seste olmayan yetkililer: 
    ${sesdedeğil.map(s => `${s} \`${s.user.tag}\``).join('\n')}`)
          }
        
        if(qqq == "dm"){
          let kullanıcı = message.guild.members.cache.filter(s => s.roles.cache.has(config.meeting.yetkili)).filter(s => !s.voice.channel).size
        for(var i = 0;i < kullanıcı;i++){
          let a = message.guild.members.cache.filter(s => s.roles.cache.has(config.meeting.yetkili)).filter(s => !s.voice.channel).map(a => a)[i]
          const userDM = await a.createDM()
        try {
          await userDM.send(`<@${a.user.id}> sese girsene qardesm!?`)
        } catch {
          await message.channel.send(`<@${a.user.id}> adlı kullanıcının dm kutusu kapalı! Müsaitsen public odalara değilsen alone odalarına geçiş yapabilirsin!`)
        }
        }
          }
        
        } else 
         return message.channel.send(`Bu komutu kullanabilmek için öncelikle gerekli yetkin olmalı.`)
    }
}