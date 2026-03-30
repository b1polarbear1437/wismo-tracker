import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req) {
  const { customerMessage, orderNumber, orderDate, currentStatus } =
    await req.json();

  const prompt = `You are an expert e-commerce customer support AI. Analyze the following customer message and order details carefully.

Customer Message: "${customerMessage}"
Order Number: ${orderNumber || "Not provided"}
Order Date: ${orderDate || "Not provided"}
Current Order Status: ${currentStatus || "Not provided"}

Instructions:
- Determine if this is a WISMO ("Where Is My Order") request or order status inquiry
- If the order date was more than 10 days ago and status is still "Processing" or "Shipped", set escalate to true
- Write the customerReply in a warm, empathetic, professional tone
- The internalNote should be concise and factual for the support team
- escalationReason should explain WHY escalation is needed (or be empty string if not needed)

Respond ONLY with a valid JSON object, no markdown, no explanation, just the JSON:
{
  "isWismo": true or false,
  "issueSummary": "one clear sentence summarizing what the customer needs",
  "customerReply": "warm, helpful reply to send directly to the customer (2-3 sentences)",
  "internalNote": "brief internal note for the support team (1-2 sentences)",
  "escalate": true or false,
  "escalationReason": "clear reason if escalation needed, empty string otherwise",
  "sentiment": "frustrated" or "neutral" or "urgent"
}`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text.trim();
    const json = JSON.parse(text);

    return Response.json(json);
  } catch (err) {
    console.error("API error:", err);
    return Response.json({ error: "Failed to analyze message" }, { status: 500 });
  }
}
