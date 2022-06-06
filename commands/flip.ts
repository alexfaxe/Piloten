import { Message } from "discord.js";

export default {
    callback: (message: Message) => {
        const result = Math.random();
        console.log(result);
        if (result > 0.49999999999999999) {
            return message.reply("Heads");
        } else {
            return message.reply("Tails");
        }
    },
}