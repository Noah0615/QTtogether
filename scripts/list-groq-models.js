
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    try {
        const models = await groq.models.list();
        console.log("Available Models:");
        models.data.forEach(m => {
            console.log(`- ${m.id} (Owner: ${m.owned_by})`);
        });
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

main();
