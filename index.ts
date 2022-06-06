import DiscordJS, {Intents} from "discord.js"
import mongoose from "mongoose";

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on("ready", async() => {
    console.log("The bot is ready.")

    await mongoose.connect(
        process.env.MONGO_URI || "",
        {
            keepAlive: true,
        });

    let handler = require('./command-handler')
    if (handler.default) {
        handler = handler.default;
    }

    handler(client)
})

client.login(process.env.DISCORD_TOKEN || "");