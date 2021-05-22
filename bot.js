require("dotenv").config();

const { default: axios } = require("axios");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TOKEN);


function addCipheringResult(title, data, id) {
    return {
        type: "article",
        id,
        thumb_url: "https://github.com/uwumouse/mindall/blob/main/public/lock.png?raw=true",
        title,
        description: data,
        input_message_content: {
            message_text: "```\n" + data + "\n```",
            parse_mode: "MarkdownV2"
        }
    }
}

bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query.trim();


    if (!query) {
        ctx.answerInlineQuery([{
            type: "article",
            id: 0,
            title: `Введи шифр...`,
            input_message_content: {
                message_text: "Я на хайпе и использую Mindall 🤟",
            },
        }]);

        return;

    }
    let encoded, decoded;
    try {
        encoded = await axios.post(process.env.API + "/cipher/encode", { original: query });
        decoded = await axios.post(process.env.API + "/cipher/decode", { original: query });
    } catch { }

    let response = [];
    if (encoded) {
        response.push(addCipheringResult("Зашифрованный вид", encoded.data.result, 0));
    }
    if (decoded) {
        response.push(addCipheringResult("Расшифрованный вид", decoded.data.result, 1));
    }

    if (!encoded && !decoded) {
        response.push(addCipheringResult("Не удалось преобразовать текст :(", "Миндаль крут 🔥"));
    }

    ctx.answerInlineQuery(response);
});

bot.on("message", (ctx) => {
    ctx.reply("Mindall - инлайн бот, он не отвечает на сообщения.");
});


bot.launch({
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN,
        port: 5000
    }
}).then(() => console.log("Bot Started."));
