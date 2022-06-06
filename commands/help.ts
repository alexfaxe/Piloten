import {Message, MessageEmbed} from "discord.js";

export default {
    callback: (message: Message) => {
        const helpEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Help")
            .addFields(
                { name: "?flip", value: "Flips a coin", inline: true },
                { name: "?opgg", value: "Returns information of League summoner on EUW server" },
                { name: "?ping", value: "pong" },
                { name: "?help", value: "Returns this menu" }
            )
            .setTimestamp()
            .setFooter( { text: 'help menu v2', iconURL: 'https://rmkcdn.successfactors.com/c45b068b/7279a8a8-f3a4-44ff-8bab-a.jpg' });

        return message.reply( {embeds: [helpEmbed] })
    },
}