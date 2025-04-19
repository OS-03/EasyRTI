import OpenAI from "openai"; // Updated import statement
import dotenv from "dotenv";

dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
// });

const chat = async (req, res) => {
  const { message } = req.body;

  // if (!message) {
  //   return res.status(400).json({ error: "Message is required" });
  // }

  // try {
  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo", // Updated model name
  //     messages: [{ role: "user", content: message }], // Updated parameter structure
  //     max_tokens: 150,
  //     temperature: 0.7,
  //   });

  //   const reply = response.choices[0].message.content.trim(); // Updated response structure
  //   res.json({ reply });
  // } catch (error) {
  //   console.error("Error with OpenAI API:", error.response?.data || error.message);

  //   if (error.response?.status === 429) {
  //     return res.status(429).json({
  //       error: "You have exceeded your current quota. Please check your plan and billing details.",
  //     });
  //   }

  //   res.status(500).json({
  //     error: "Failed to process the request. Please try again later.",
  //   });
  // }
};

export default chat;