const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // Note: The Node.js SDK doesn't expose listModels directly on genAI instance in some versions,
        // but usually it's available via the API or we can try a direct fetch if SDK fails.
        // Let's try to infer or use the basic model first.
        // Actually, for SDK v0.24.1, we might not have a direct listModels helper easily accessible on the main class 
        // without using the model manager. 
        // Let's try a direct REST call which is safer to list models.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(model => {
                console.log(`- ${model.name} (${model.displayName})`);
                console.log(`  Description: ${model.description}`);
                console.log(`  Supported: ${model.supportedGenerationMethods.join(", ")}`);
                console.log("---");
            });
        } else {
            console.error("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
