// scripts/test-zai.js
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const apiKey = process.env.ZAI_API_KEY;

if (!apiKey) {
  console.error("ZAI_API_KEY is missing");
  process.exit(1);
}

console.log("Testing Z.AI with key:", apiKey.substring(0, 5) + "...");

const models = [
  "glm-4-flash",
  "GLM-4-Flash",
  "glm-4",
  "glm-4-plus",
  "glm-4-air",
  "glm-4v-flash",
  "glm-4.0-flash",
];

async function testModel(modelName) {
  console.log(`Testing model: ${modelName}...`);
  try {
    const response = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "user",
              content: 'Hello, answer in JSON: { "status": "ok" }',
            },
          ],
          temperature: 0.1,
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(
        `FAILED ${modelName}: ${response.status} - ${text.substring(0, 100)}...`,
      );
      return false;
    } else {
      const data = await response.json();
      console.log(`SUCCESS ${modelName}:`, JSON.stringify(data, null, 2));
      return true;
    }
  } catch (e) {
    console.error(`ERROR ${modelName}:`, e.message);
    return false;
  }
}

async function runTests() {
  for (const model of models) {
    if (await testModel(model)) {
      console.log(`Found working model: ${model}`);
      break;
    }
  }
}

runTests();
