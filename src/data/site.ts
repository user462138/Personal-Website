export const site = {
  name: "Yazan Dukhan",
  title: "Yazan Dukhan · Software Engineer",
  description: "Yazan Dukhan, software engineer building software and AI that helps people explore more.",
  email: "yazandukhan@hotmail.com",
  github: "https://github.com/user462138",
  /** Cal.com username; booking pages are cal.com/<calUser>/<slug>. */
  calUser: "yazandukhan",
  calls: [
    { title: "Quick intro", text: "Say hello, ask about my work or a role.", length: "15 min", slug: "15min" },
    { title: "Talk about a project", text: "Walk me through what you'd like to build.", length: "30 min", slug: "30min" },
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      school: "Artesis Plantijn University",
      place: "Antwerp",
      years: "2022 – 2025",
      text: "Data structures and algorithms, object-oriented programming and design, computer organization, combinatorics, and statistics.",
    },
    {
      degree: "A.S. in Architecture",
      school: "Edukempen CVO",
      place: "Antwerp",
      years: "2020 – 2022",
      text: "Architectural design studios, digital design and fabrication with Revit, urban design and planning, and drawing with CAD.",
    },
  ],
  certifications: [
    {
      title: "Associate AI Engineer for Developers",
      issuer: "DataCamp",
      year: 2026,
      text: "A 29-hour track on building with the OpenAI API, embeddings, LangChain agents, Pinecone, Hugging Face and MCP.",
      /** Official page where anyone can check the certificate. */
      verifyUrl: "https://www.datacamp.com/completed/statement-of-accomplishment/track/8b9b32d2c14df37c8c5e9529c82814aaebb2ca07",
      /** Certificate image in public/ shown in the pop-up; leave empty to only link to verifyUrl. */
      image: "/certificates/datacamp-associate-ai-engineer.png",
      imageWidth: 2000,
      imageHeight: 1154,
    },
  ],
  /**
   * URL of the deployed ask-api Worker, e.g. "https://portfolio-ask-api.<your-subdomain>.workers.dev/ask".
   * Leave empty to use only the built-in keyword answers in src/data/answers.ts.
   */
  askApi: "https://portfolio-ask-api.yazandukhan.workers.dev/ask",
} as const;

/** Prefix a site path with the configured base, e.g. url("/work/numble/"). */
export function url(path = "/"): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return base + (path.startsWith("/") ? path : `/${path}`);
}
