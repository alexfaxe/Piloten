import {Message, MessageEmbed} from "discord.js";
import axios from "axios";
import {getChampionName} from "twisted/dist/constants";
import {summonerByName, leagueById, getHighestMasteryChamp, getSoloqRank } from "../api/league";

const profilePictureURL = "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/";

axios.defaults.headers.common['X-Riot-Token'] = process.env.RIOT_API_KEY || "";

function fixName(name: string[]) {
    let newName;

    if (name.length > 1) {
        newName = name.join(" ");
        console.log("Transformed name: " + newName);
        return newName;
    }
    return name.toString();
}

export default {
    callback: async (message: Message, ...args: string[]) => {
        let name = fixName(args);

        let summoner;
        let rank;
        let highestMastery;

        console.log("Name: " + name);

        if (name.length > 19 || name.length < 3) {
            console.error("Name is outside of Riot Games limitations. (length)");
            return message.reply("Name is outside of Riot Games limitations.");
        }

        try {
            summoner = await summonerByName(name);
            rank = await leagueById(summoner.id);
            highestMastery = await getHighestMasteryChamp(summoner.id);
            await getSoloqRank(summoner.id);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.error("Axios error: \n" + e);
                return message.reply(e.toString());
            } else {
                console.error("Non-axios error: \n" + e);
                return message.reply("Could not fetch user.");
            }
        }

        let opggURL = encodeURI("https://euw.op.gg/summoners/euw/" + summoner.name);

        //TODO: add winrate
        const summonerLookup = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(summoner.name)
            .setURL(opggURL)
            .setThumbnail(profilePictureURL + summoner.profileIconId + ".jpg")
            .addField("Level", summoner.summonerLevel.toString())
            .addField("Highest mastery", getChampionName(highestMastery[0].championId))
            .addField("Rank", rank[0].tier + " " + rank[0].rank + " " + rank[0].leaguePoints + " LP")
            .setTimestamp()
            .setFooter( { text: 'gaming lookup v24', iconURL: 'https://rmkcdn.successfactors.com/c45b068b/7279a8a8-f3a4-44ff-8bab-a.jpg' });

        try {
            await message.reply({embeds: [summonerLookup]});
        } catch (e) {
            console.error(e);
            return message.reply("Embed broke =/");
        }
    },
}