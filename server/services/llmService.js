const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateIntervention = async ({
  student,
  risk,
  previousInterventions = []
}) => {
  const previousHistory =
    previousInterventions.length > 0
      ? previousInterventions
          .map(
            (item) =>
              `${item.type} -> ${item.outcome || item.status}`
          )
          .join("\n")
      : "No previous interventions";

  const prompt = `
Student Name: ${student.name}

Risk Level: ${risk.level}
Risk Score: ${risk.score}

Risk Reasons:
${risk.reasons.join("\n")}

Previous Intervention History:
${previousHistory}

Allowed interventions:
1. Mentor Meeting
2. Peer Tutoring
3. Remedial Class
4. Parent Contact
5. Counsellor Referral

Rules:
- Select only one intervention from the allowed list.
- Do not repeat an intervention that previously failed.
- If previous interventions failed repeatedly, escalate support.
- Base the recommendation on the student's risk reasons.
- Keep the reason concise.
- owner must be one of:
  Class Mentor
  Subject Teacher
  Counsellor
- deadlineDays must be between 1 and 7.

Return ONLY valid JSON in this exact format:

{
  "type": "intervention name",
  "reason": "short explanation",
  "owner": "responsible person",
  "deadlineDays": 3
}
`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an educational intervention planning assistant. Return only valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],

    model: "openai/gpt-oss-120b",

    temperature: 0.2
  });

  const response =
    completion.choices[0].message.content;

  try {
    return JSON.parse(response);
  } catch (error) {
    throw new Error(
      "LLM returned invalid JSON: " + response
    );
  }
};

module.exports = {
  generateIntervention
};