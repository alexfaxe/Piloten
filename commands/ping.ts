import { Message } from "discord.js";

export default {
    callback: (message: Message, ...args: string[]) => {
        console.log(args)
        message.reply("pong");
    },
}