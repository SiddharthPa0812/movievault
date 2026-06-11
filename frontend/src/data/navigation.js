import {
  BarChart3,
  Clapperboard,
  Film,
  Heart,
  LayoutDashboard,
  ListVideo,
  PlusSquare,
  Sparkles,
  Star,
} from "lucide-react";

export const navigationGroups = [
  {
    title: "Dashboard",
    items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard }],
  },
  {
    title: "Movies",
    items: [
      { label: "All Movies", path: "/movies", icon: Film },
      { label: "Categories", path: "/movies/categories", icon: Clapperboard },
      { label: "Add Movie", path: "/entries/new?type=Movie", icon: PlusSquare },
    ],
  },
  {
    title: "Anime",
    items: [
      { label: "All Anime", path: "/anime", icon: Sparkles },
      { label: "Categories", path: "/anime/categories", icon: ListVideo },
      { label: "Add Anime", path: "/entries/new?type=Anime", icon: PlusSquare },
    ],
  },
  {
    title: "General",
    items: [
      { label: "Watchlist", path: "/watchlist", icon: Star },
      { label: "Favorites", path: "/favorites", icon: Heart },
      { label: "Statistics", path: "/statistics", icon: BarChart3 },
    ],
  },
];

export const movieCategories = [
  { name: "Legendary", range: "10/10", icon: "Sparkles" },
  { name: "Masterpiece", range: "9-9.9", icon: "Award" },
  { name: "Amazing", range: "8-8.9", icon: "Star" },
  { name: "Good", range: "6-7.9", icon: "ThumbsUp" },
  { name: "Average", range: "4-5.9", icon: "Gauge" },
  { name: "Bad", range: "0-3.9", icon: "TriangleAlert" },
];

export const animeCategories = [
  { name: "S Tier", description: "All-time elite picks", icon: "Crown" },
  { name: "A Tier", description: "Highly recommended favorites", icon: "Medal" },
  { name: "B Tier", description: "Strong and memorable", icon: "Shield" },
  { name: "C Tier", description: "Solid casual watches", icon: "Layers3" },
  { name: "D Tier", description: "Only for completists", icon: "BadgeMinus" },
  { name: "Dropped", description: "Left unfinished", icon: "CircleOff" },
];
