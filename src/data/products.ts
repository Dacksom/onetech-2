export type Sede = "Sambil Maracaibo" | "La Chinita";

export type Category =
  | "laptops"
  | "monitores"
  | "cpus"
  | "pc"
  | "accesorios"
  | "mobiliario";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  emoji: string;
  image?: string;
  images?: string[];
  estado: "Nuevo" | "Refurbished";
  price: number;
  priceOriginal?: number;
  colors?: { label: string; hex: string }[];
  specs: Record<string, string>;
  tagline?: string;
  stock: Record<Sede, number>;
  highlighted?: boolean;
};

export const SEDES: Sede[] = ["Sambil Maracaibo", "La Chinita"];

export const CATEGORIES: {
  id: Category;
  label: string;
  emoji: string;
}[] = [
  { id: "laptops", label: "Laptops", emoji: "💻" },
  { id: "monitores", label: "Monitores", emoji: "🖥️" },
  { id: "pc", label: "PC Gamer", emoji: "🎮" },
  { id: "cpus", label: "CPUs", emoji: "🖲️" },
  { id: "accesorios", label: "Accesorios", emoji: "🎧" },
  { id: "mobiliario", label: "Mobiliario", emoji: "🪑" },
];

export const BRANDS = [
  "Compaq",
  "Nexxus",
  "Bellgo",
  "Dell",
  "HP",
  "Lenovo",
  "Onikuma",
  "Dahua",
];

export const PRODUCTS: Product[] = [
  {
    id: "555026",
    name: "Q-Book+",
    brand: "Compaq",
    category: "laptops",
    emoji: "💻",
    image: "/products/laptop-compaq-q-book+.jpeg",
    estado: "Nuevo",
    price: 480,
    priceOriginal: 560,
    tagline: "Ryzen 5 · 15.6\" FHD",
    colors: [
      { label: "Grafito", hex: "#2a2a32" },
      { label: "Plata", hex: "#cfd4dc" },
    ],
    specs: {
      Procesador: "AMD Ryzen 5 3500U (2.1–3.7GHz)",
      RAM: "8GB DDR4",
      Almacenamiento: "256GB SSD NVMe",
      Pantalla: '15.6" FHD',
      Gráficos: "Radeon Vega 8",
    },
    stock: { "Sambil Maracaibo": 4, "La Chinita": 2 },
    highlighted: true,
  },
  {
    id: "555027",
    name: "Dreamy Book Series",
    brand: "Nexxus",
    category: "laptops",
    emoji: "💻",
    image: "/products/laptop-nexxus-dreamy-book.jpeg",
    estado: "Nuevo",
    price: 410,
    priceOriginal: 470,
    tagline: "16GB RAM · Ultra ligera",
    colors: [
      { label: "Negro", hex: "#0f1116" },
      { label: "Azul", hex: "#1a3cb5" },
    ],
    specs: {
      Procesador: "AMD Ryzen 3 3200U",
      RAM: "16GB DDR4",
      Almacenamiento: "256GB SSD",
      Pantalla: '15.6" HD Slim',
      Gráficos: "AMD Radeon Vega 3",
    },
    stock: { "Sambil Maracaibo": 6, "La Chinita": 3 },
    highlighted: true,
  },
  {
    id: "653002",
    name: '27" Blanco Gaming',
    brand: "Bellgo",
    category: "monitores",
    emoji: "🖥️",
    image: "/products/monitor-bellgo-27-blanco-gaming.jpeg",
    estado: "Nuevo",
    price: 210,
    priceOriginal: 240,
    tagline: "165Hz · 1ms",
    colors: [
      { label: "Blanco", hex: "#f5f6f8" },
      { label: "Negro", hex: "#0f1116" },
    ],
    specs: {
      Frecuencia: "165Hz",
      "Tiempo de respuesta": "1ms",
      Tecnología: "Flicker-Free, Low Blue Light",
      Puertos: "HDMI, DisplayPort",
      Curvatura: "Plano",
    },
    stock: { "Sambil Maracaibo": 3, "La Chinita": 5 },
    highlighted: true,
  },
  {
    id: "653019",
    name: '27" Neon',
    brand: "Bellgo",
    category: "monitores",
    emoji: "🖥️",
    image: "/products/monitor-bellgo-27-neon.jpeg",
    estado: "Nuevo",
    price: 200,
    tagline: "VA · 165Hz",
    specs: {
      Frecuencia: "165Hz",
      "Tiempo de respuesta": "1ms",
      Panel: "VA",
      Brillo: "300 cd/m²",
    },
    stock: { "Sambil Maracaibo": 0, "La Chinita": 0 },
  },
  {
    id: "651005",
    name: 'Monitor 27" Refurbished',
    brand: "Genérico",
    category: "monitores",
    emoji: "🖥️",
    image: "/products/monitor-27-refurbished.jpeg",
    estado: "Refurbished",
    price: 85,
    tagline: "1080p · 60Hz",
    specs: {
      Resolución: "1920x1080",
      "Tasa de refresco": "60Hz",
      Conectividad: "VGA / DVI",
    },
    stock: { "Sambil Maracaibo": 0, "La Chinita": 0 },
  },
  {
    id: "451205",
    name: "Core i5 1ra Gen",
    brand: "Dell / HP / Lenovo",
    category: "cpus",
    emoji: "🖲️",
    estado: "Refurbished",
    price: 50,
    tagline: "Torre básica para oficina",
    specs: {
      Procesador: "Intel Core i5-650",
      RAM: "4GB DDR3",
      Almacenamiento: "160–500GB HDD",
      OS: "Compatible con Windows 10",
    },
    stock: { "Sambil Maracaibo": 0, "La Chinita": 0 },
  },
  {
    id: "451331",
    name: "Core i7 10ma Gen",
    brand: "Dell",
    category: "cpus",
    emoji: "🖲️",
    image: "/products/cpu_i7.png",
    estado: "Refurbished",
    price: 580,
    tagline: "i7-10700 · 16GB",
    specs: {
      Procesador: "Intel Core i7-10700",
      RAM: "16GB DDR4",
      Almacenamiento: "256GB SSD o 1TB HDD",
      Gráficos: "Intel UHD Graphics 630",
    },
    stock: { "Sambil Maracaibo": 0, "La Chinita": 0 },
  },
  {
    id: "451105",
    name: "Core i3 2da Gen",
    brand: "HP",
    category: "cpus",
    emoji: "🖲️",
    image: "/products/cpu_i3.png",
    estado: "Refurbished",
    price: 65,
    specs: {
      Procesador: "Intel Core i3-2100",
      RAM: "4GB DDR3",
      Almacenamiento: "500GB HDD",
    },
    stock: { "Sambil Maracaibo": 0, "La Chinita": 0 },
  },
  {
    id: "PC-GAMER-5600",
    name: "Combo Ryzen 5 Gamer",
    brand: "ONETECH",
    category: "pc",
    emoji: "🎮",
    image: "/products/combo-pc-gamer-completa-monitor-bellgo.jpeg",
    images: ["/products/combo-pc-gamer-completa-monitor-bellgo.jpeg", "/products/combo-pc-gamer-solo-torre.jpeg"],
    estado: "Nuevo",
    price: 1115,
    priceOriginal: 1290,
    tagline: "RX 580 · 144Hz · Mecánico",
    colors: [{ label: "Negro", hex: "#0f1116" }],
    specs: {
      CPU: "AMD Ryzen 5 5600",
      GPU: "RX 580 8GB VRAM",
      RAM: "16GB DDR4",
      SSD: "512GB NVMe",
      Monitor: 'MSI PRO 24" 144Hz',
      Teclado: "Mecánico Redragon",
    },
    stock: { "Sambil Maracaibo": 2, "La Chinita": 1 },
    highlighted: true,
  },
  {
    id: "201020",
    name: "X15 Pro RGB",
    brand: "Onikuma",
    category: "accesorios",
    emoji: "🎧",
    image: "/products/audifono-onikuma-x15-pro-rgb.jpeg",
    estado: "Nuevo",
    price: 30,
    tagline: "Over-ear · RGB",
    colors: [
      { label: "Negro", hex: "#0f1116" },
      { label: "Rojo", hex: "#e53e3e" },
    ],
    specs: {
      Tipo: "Over-ear",
      Micrófono: "Reducción de ruido",
      Iluminación: "LED RGB",
      Interfaz: "USB + 3.5mm",
    },
    stock: { "Sambil Maracaibo": 12, "La Chinita": 8 },
  },
  {
    id: "ROUT-DAHUA",
    name: "AX1500 Wi-Fi 6",
    brand: "Dahua",
    category: "accesorios",
    emoji: "📡",
    image: "/products/router_dahua.png",
    estado: "Nuevo",
    price: 29,
    tagline: "Wi-Fi 6 · Dual Band",
    specs: {
      Estándar: "802.11ax",
      Bandas: "Dual Band 2.4 / 5GHz",
      Antenas: "4 de alta ganancia",
      Seguridad: "WPA3",
    },
    stock: { "Sambil Maracaibo": 9, "La Chinita": 7 },
  },
  {
    id: "603011",
    name: "Silla Oficina Vintage",
    brand: "Genérico",
    category: "mobiliario",
    emoji: "🪑",
    image: "/products/silla_oficina_vintage.png",
    estado: "Nuevo",
    price: 50,
    tagline: "Estilo retro",
    specs: {
      Estilo: "Retro",
      Material: "Sintético",
      Base: "Cromada",
      Ajuste: "Altura neumática",
    },
    stock: { "Sambil Maracaibo": 0, "La Chinita": 0 },
  },
  {
    id: "603008",
    name: "Silla Ejecutiva Negra 9102",
    brand: "Genérico",
    category: "mobiliario",
    emoji: "🪑",
    image: "/products/silla_ejecutiva_negra.png",
    estado: "Nuevo",
    price: 70,
    specs: {
      Respaldo: "Malla antitranspirante",
      Apoyabrazos: "Fijos",
      "Soporte lumbar": "Ergonómico",
    },
    stock: { "Sambil Maracaibo": 0, "La Chinita": 0 },
  },
  {
    id: "504026",
    name: "Silla Gamer Hello Kitty",
    brand: "Genérico",
    category: "mobiliario",
    emoji: "🪑",
    image: "/products/silla_gamer_kitty.png",
    estado: "Nuevo",
    price: 165,
    tagline: "Reclinable · Edición Kitty",
    colors: [
      { label: "Rosado", hex: "#f8b4c4" },
      { label: "Blanco", hex: "#f5f6f8" },
    ],
    specs: {
      Color: "Rosado / Blanco",
      Reclinación: "150 grados",
      Almohadillas: "Lumbar y Cervical incluidas",
      Bordado: "Hello Kitty Original Style",
    },
    stock: { "Sambil Maracaibo": 2, "La Chinita": 1 },
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function totalStock(p: Product) {
  return SEDES.reduce((n, s) => n + p.stock[s], 0);
}

export function isAvailable(p: Product) {
  return totalStock(p) > 0;
}
