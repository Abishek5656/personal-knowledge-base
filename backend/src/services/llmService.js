import dotenv from "dotenv";

dotenv.config();

export async function callOpenRouter(prompt) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: `You are a helpful assistant that answers strictly from provided context.\n\n${prompt}`,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API Error:", errorText);
    throw new Error(
      `OpenRouter API failed with status ${response.status}: ${errorText}`,
    );
  }

  const data = await response.json();

  if (!data.choices || !data.choices.length) {
    console.error(
      "Unexpected OpenRouter response format:",
      JSON.stringify(data, null, 2),
    );
    throw new Error("Invalid response format from OpenRouter");
  }

  return data.choices[0].message.content;
}
