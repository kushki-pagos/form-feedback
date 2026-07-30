// Datos estáticos: categorías, páginas y copys del formulario de feedback Kushki.

const CATEGORIES = [
  {
    id: "home-especiales",
    label: "Home / Especiales",
    pages: ["Homepage", "Form de contacto"],
  },
  {
    id: "plataforma-pagos-en-linea",
    label: "Plataforma - Pagos en línea",
    pages: [
      "Online payments (CNP)",
      "API",
      "Kajita",
      "Payment button",
      "Smartlinks",
      "E-commerce plugins",
      "JS libraries",
    ],
  },
  {
    id: "plataforma-pagos-presenciales",
    label: "Plataforma - Pagos presenciales",
    pages: ["In-store payments (CP)", "Kushki One", "Terminals & hardware", "Billpocket"],
  },
  {
    id: "plataforma-infraestructura",
    label: "Plataforma - Infraestructura",
    pages: [
      "Platform overview",
      "Payouts",
      "Acquiring",
      "Fraud & risk management",
      "Dashboard & console",
      "Stablecoin settlements",
    ],
  },
  {
    id: "soluciones-para-empresas",
    label: "Soluciones - Para empresas",
    pages: [
      "Solutions overview",
      "For enterprises & merchants",
      "Recurring payments",
      "Omni-channel commerce",
      "Marketplaces & platforms",
      "Cross-border payments",
    ],
  },
  {
    id: "soluciones-para-socios",
    label: "Soluciones - Para socios",
    pages: [
      "For partners & distributors",
      "For PSPs",
      "For ISOs",
      "For technology partners",
      "Partner portal",
    ],
  },
  {
    id: "industrias",
    label: "Industrias",
    pages: [
      "Industries overview",
      "Insurance",
      "Hospitality",
      "Education",
      "Utilities",
      "Travel & mobility",
      "Gaming & high risk",
      "E-commerce & retail",
      "Financial services & fintech",
      "SaaS & digital services",
    ],
  },
  {
    id: "empresa",
    label: "Empresa",
    pages: [
      "About Kushki",
      "Careers",
      "Where we operate",
      "Corporate Governance",
      "Security & compliance",
      "Kushki Operadora",
      "Awards",
      "Newsroom/press",
    ],
  },
  {
    id: "legal",
    label: "Legal",
    pages: [
      "Legal hub",
      "Terms & conditions",
      "Privacy policy",
      "Cookie policy",
      "Data protection policy",
      "AML/KYC policy",
      "Acceptable use policy",
      "SLA",
      "Regulatory disclosures",
    ],
  },
  {
    id: "recursos",
    label: "Recursos",
    pages: [
      "Payment methods directory",
      "Resources hub",
      "Case studies",
      "Whitepapers & guides",
      "Webinars & events",
      "Blog",
    ],
  },
  {
    id: "ia",
    label: "IA",
    pages: ["AI overview", "KODA", "Shaman", "The world model", "AI-native"],
  },
  {
    id: "mercados",
    label: "Mercados",
    pages: ["Brazil", "Central America & Caribbean", "Ecuador", "Mexico", "Colombia", "Chile", "Peru"],
  },
  {
    id: "desarrolladores",
    label: "Desarrolladores",
    pages: [
      "API reference",
      "Documentation portal",
      "Status page",
      "Changelog",
      "SDKs & libraries",
      "Plugins & integrations",
      "Developers overview",
      "Engineering blog",
    ],
  },
];

const VARIAS_CATEGORIAS_VALUE = "Varias categorías";

// Mapa página -> categoría, usado para etiquetar cada ajuste con su categoría real,
// incluso cuando el stakeholder eligió "Varias categorías".
const PAGE_TO_CATEGORY = {};
CATEGORIES.forEach((cat) => {
  cat.pages.forEach((page) => {
    PAGE_TO_CATEGORY[page] = cat.label;
  });
});

const REVIEW_QUESTIONS = [
  {
    id: "q1",
    text: "¿El contenido de la(s) página(s) seleccionada(s) es acorde a la comunicación y valores de Kushki?",
  },
  {
    id: "q2",
    text: "¿La información presentada es correcta y está actualizada?",
  },
  {
    id: "q3",
    text: "¿El contenido es claro y fácil de entender para el público objetivo?",
  },
  {
    id: "q4",
    text: "¿Tienes algún ajuste o comentario sobre el contenido?",
  },
];

const ANSWER_OPTIONS = ["Sí", "No", "Parcialmente"];

const SHEET_ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbxAm85MvbxPDmj28iPu194Fxh8lSyeT3gfwZe_fd5_fuWp6Ys6TCz0ZATBvB4HIG2cbMw/exec";
