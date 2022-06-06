import axios from "axios";

interface ISummoner {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    summonerLevel: number;
}

interface IMastery {
    championId: number,
    championLevel: number,
    championPoints: number,
    lastPlayTime: number,
    championPointsSinceLastLevel: number,
    championPointsUntilNextLevel: number,
    chestGranted: boolean,
    tokensEarned: number,
    summonerId: string
}

interface ILeague {
    leagueId: string,
    queueType: string,
    tier: string,
    rank: string,
    summonerId: string,
    summonerName: string,
    leaguePoints: number,
    wins: number,
    losses: number,
    veteran: boolean,
    inactive: boolean,
    freshBlood: boolean,
    hotStreak: boolean

}

export async function summonerByName(name: string): Promise<ISummoner> {
    const summonerByNameURL = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
    const goodURL = encodeURI(summonerByNameURL + name);

    return await axios.get<ISummoner>(goodURL)
        .then((res => {
            return res.data;
        }))
}

export async function leagueById(id: string): Promise<ILeague[]> {
    const leagueByURL = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/";
    const goodURL = encodeURI(leagueByURL + id);

    return await axios.get(goodURL)
        .then((res => {
            return res.data;
        }))
}

export async function masteryById(id: string): Promise<IMastery[]> {
    const masteryByURL = "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/";
    const goodURL = encodeURI(masteryByURL + id);

    return await axios.get(goodURL)
        .then((res => {
            return res.data;
        }))
}

export async function getHighestMasteryChamp(id: string) {
    let mastery = await masteryById(id);
    let highestPoints = Math.max(...(mastery.map(champ => champ.championPoints)))

    return mastery.filter(champ => champ.championPoints === highestPoints);
}

export async function getSoloqRank(id: string) {
    let summonerData = await leagueById(id);
    let summonersRift = summonerData.find(q => {
        return q.queueType === "RANKED_SOLO_5x5";
    })
    return summonersRift?.tier + " " + summonersRift?.rank + " " + summonersRift?.leaguePoints + " LP"
}