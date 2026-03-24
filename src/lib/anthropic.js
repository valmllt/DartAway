const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const MODEL = 'llama-3.3-70b-versatile'

async function groqChat(prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`Groq error ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content.trim()
}

export async function fetchFunFact(country) {
  return groqChat(
    `Donne-moi 1 fait insolite et surprenant sur ${country.name} (capitale : ${country.capital}). ` +
    `Réponds en 2-3 phrases maximum, en français, de manière engageante et mémorable. Pas de titre, juste le texte.`
  )
}

export async function fetchManagerMessage(country) {
  return groqChat(
    `Écris un message court (3-4 phrases) qu'un manager pourrait envoyer à son équipe pour annoncer ` +
    `un déplacement professionnel à ${country.capital}, ${country.name}. ` +
    `Ton professionnel avec une légère touche d'humour. En français. Pas de titre, juste le texte.`
  )
}
