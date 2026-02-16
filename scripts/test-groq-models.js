
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    try {
        console.log("Testing deepseek-r1-distill-llama-70b...");
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Hello, represent yourself." }],
            model: "deepseek-r1-distill-llama-70b",
        });
        console.log("Success! Response:", completion.choices[0].message.content);
    } catch (err) {
        console.error("DeepSeek Failed:", err.message);

        try {
            console.log("Testing mixed-model (mixtral-8x7b-32768)...");
            const completion2 = await groq.chat.completions.create({
                messages: [{ role: "user", content: "Hello?" }],
                model: "mixtral-8x7b-32768",
            });
            console.log("Mixtral Success! Response:", completion2.choices[0].message.content);
        } catch (err2) {
            console.error("Mixtral Failed:", err2.message);
        }
    }
}

main();
