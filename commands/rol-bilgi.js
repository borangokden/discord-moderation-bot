const Discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "rol-bilgi",
  aliases: ["rol-bilgi"],
  run: async (client, message, args) => {
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(rol => rol.id === args[0]);
  
  var wasait = new Discord.MessageEmbed()
  
  .setColor("RED")
  .setDescription(`Öncelikle bir rol etiketlemelisin!`);
  
  if(!role) return message.channel.send(wasait);
  
  var moment = require("moment");
  var temps = moment(message.createdTimestamp).format("LLLL");
  
  var wasaitEmbed = new Discord.MessageEmbed()
  
  .setColor('RANDOM')
  
  .addField('Rol adı:', role.name, true)
  .addField('ID:', role.id, true)
  .addField('Bu role sahip kullanıcılar:', role.members.size, true)
  .addField('Renk:', role.hexColor, true)
  .addField('Etiket:', role.mentionable ? '\nEvet Var' : 'Hayır Yok', true)
  .addField('Rol oluşturma tarihi:', moment(role.createdAt).format("LL"), true)
  
  message.channel.send(wasaitEmbed)
  }
}