const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : null;

async function checkModels() {
    if (!apiKey) {
        console.error("No API Key found in .env.local");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-exp",
        "gemini-2.5-flash"
    ];

    console.log("Testing Models availability...");
    for (const m of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("Hi");
            console.log(`✅ ${m}: Working`);
        } catch (e) {
            console.log(`❌ ${m}: ${e.message}`); // Full error
        }
    }
}

checkModels();
