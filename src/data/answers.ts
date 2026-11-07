// Built-in answers for the Questions box, used when the AI API is off or unreachable.
export interface Answer {
  keywords: string[];
  answer: string;
}

export const answers: Answer[] = [
  { keywords: ["numble", "internship", "intern", "event"], answer: "At Numble I built a full-stack event management app: a .NET 8 API, a Vue 3 front end, sign-in with roles through Azure AD B2C, notifications through Azure Service Bus, and CI/CD in Azure DevOps." },
  { keywords: ["quote", "microtron", "erp", "sales"], answer: "QUOTE+ is an internal tool for Microtron's sales team. It turns plain ERP quotes into branded proposals, with templates, approval steps and single sign-on. Built with C#, .NET and React." },
  { keywords: ["pokemon", "pokémon", "game"], answer: "A personal web game for catching, comparing and battling Pokémon, built with Node.js, Express and MongoDB and tested with Jest. You can try it at tyj.onrender.com." },
  { keywords: ["stack", "tech", "language", "skill", "tools", ".net", "c#", "vue", "react", "azure", "typescript", "astro"], answer: "Mostly C# and .NET with SQL Server, Vue 3 or React with TypeScript, and Azure. I also use Node.js, MongoDB, Docker and Git. This site is built with Astro." },
  { keywords: ["open", "available", "hire", "hiring", "job", "freelance", "work with", "role"], answer: "Yes, I'm open to full-time roles and freelance projects. The easiest way to start is to book a quick intro call above." },
  { keywords: ["architecture", "study", "studies", "education", "degree", "university", "school"], answer: "I studied architecture at Edukempen CVO (2020–2022), then computer science at Artesis Plantijn University in Antwerp (2022–2025)." },
  { keywords: ["ai", "datacamp", "llm"], answer: "I recently earned DataCamp's Associate AI Engineer for Developers certificate, working with the OpenAI API, embeddings, LangChain, Pinecone, Hugging Face and MCP. I like adding small, useful AI features to everyday tools." },
  { keywords: ["call", "meet", "talk", "contact", "email", "reach", "book"], answer: "You can book a 15 or 30 minute call in the section above, or email yazandukhan@hotmail.com." },
  { keywords: ["where", "location", "based", "remote", "country", "belgium", "antwerp"], answer: "I'm based in Antwerp, Belgium, and work remotely with people and teams anywhere." },
  { keywords: ["stad", "antwerpen", "support", "helpdesk"], answer: "I worked as an IT support student at Stad Antwerpen in the summer of 2024, helping municipal staff with hardware and software and setting up new devices." },
];

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function findAnswer(question: string): string {
  const q = norm(question);
  let best: Answer | null = null;
  let score = 0;
  for (const entry of answers) {
    const s = entry.keywords.reduce((sum, k) => (q.includes(norm(k)) ? sum + k.length : sum), 0);
    if (s > score) {
      score = s;
      best = entry;
    }
  }
  return best?.answer ?? "I don't have an answer for that here. Book a quick call above and ask me directly.";
}
