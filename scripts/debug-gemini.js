// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY is missing in .env.local");
  process.exit(1);
}

// Masked Key Check
console.log(
  `API Key Loaded: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)} (Length: ${apiKey.length})`,
);

async function checkModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log(`Fetching models from: ${url.replace(apiKey, "HIDDEN_KEY")}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("API Error Status:", response.status);
      console.error("API Error Body:", JSON.stringify(data, null, 2));
    } else {
      console.log("Available Models:");
      if (data.models) {
        data.models.forEach((m) => console.log(`- ${m.name}`));
      } else {
        console.log("No models returned (empty list).");
      }
    }
  } catch (error) {
    console.error("Network Error:", error);
  }
}

checkModels();
