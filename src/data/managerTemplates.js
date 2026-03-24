const TEMPLATES = [
  (c) => `Chers collègues, je serai absent pour affaires à ${c.capital}, ${c.name}. Non, ce n'est pas des vacances. Oui, j'aurai quand même du soleil. Non, je ne vous ramènerai pas de magnets. Bonne semaine à tous.`,
  (c) => `Équipe, je pars en déplacement à ${c.capital}. En cas d'urgence : appelez. En cas d'urgence vraiment sérieuse : envoyez un email. En cas de catastrophe totale : gérez, vous êtes des adultes. À bientôt.`,
  (c) => `Information capitale (c'est le cas de le dire) : je serai à ${c.capital}, ${c.name}, pour une série de réunions que j'aurais pu faire en visio mais bon, le budget voyage existait. Je rentre vendredi. Ne touchez pas à mon bureau.`,
  (c) => `Bonjour à tous. Je m'envole pour ${c.name} ce matin, ce qui signifie que pendant quelques jours, vos questions sans réponse seront légèrement plus sans réponse qu'habituellement. Faites de votre mieux. J'ai confiance. Environ.`,
  (c) => `Mission à ${c.capital} cette semaine. Je serai joignable entre deux réunions, soit principalement la nuit. Mon IA peut répondre à 80% de vos emails, et franchement vous ne verrez pas la différence. Bon courage.`,
  (c) => `Déplacement pro à ${c.capital}, ${c.name}. Les rumeurs selon lesquelles je choisis mes destinations sur une carte les yeux fermés sont totalement infondées. Enfin, presque. Bonne semaine, l'équipe.`,
  (c) => `Je serai à ${c.capital} jusqu'à jeudi. Si quelqu'un me cherche : non. Si c'est urgent : définissez urgent. Si le bâtiment brûle : appelez les pompiers, pas moi. Bisous.`,
  (c) => `Team, cap sur ${c.name} ! Pour ceux qui se demandent pourquoi moi et pas vous : c'est parce que j'ai un titre avec plus de mots dans mon intitulé de poste. Je reviens avec des retours stratégiques et potentiellement un rhume d'avion.`,
]

export function getManagerMessage(country) {
  const idx = country.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % TEMPLATES.length
  return TEMPLATES[idx](country)
}
