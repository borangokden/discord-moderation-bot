const Discord = require("discord.js");
const db = require("quick.db")
const config = require("../config.json")

module.exports = {
name: "unjail",
aliases: [],
run: async(client , message , args) => {

let member = message.mentions.members.first()
if(!member) return message.channel.send(new Discord.MessageEmbed().setDescription(`Bir Üye Etiketle`))
let rol = await db.get(`roles.${member.id}`);
let nick = await db.get(`isim.${member.id}`)
member.roles.set(rol).catch(e => { });
member.setNickname(nick)

const embed = new Discord.MessageEmbed()
.setDescription(`${member.displayName} kullanıcısı başarıyla ${message.author} tarafından jailden çıkartıldı!`)
message.channel.send(embed)
  
  message.guild.channels.cache.get(config.penals.jail.log).send(`${member.displayName} kullancısının ${message.author} tarafından jailden çıkartıldı!`)
db.delete(`eskirolleri.${member.id}`);
db.delete(`isim.${member.id}`);
}}