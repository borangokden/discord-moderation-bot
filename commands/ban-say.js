module.exports = {
  name: "bansay",
  aliases: [],
  run: async (client, message, args) => {
    let guild = message.guild;

    guild.fetchBans()
        .then(bans => message.channel.send(` > 🔐 Sunucunuzda **${bans.size}** banlanmış üye bulunmaktadır!   `))
        .catch(console.error);
  }
}