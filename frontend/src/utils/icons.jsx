import {
  Award,
  BadgeMinus,
  CircleOff,
  Crown,
  Gauge,
  Layers3,
  Medal,
  Shield,
  Sparkles,
  Star,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";

const iconMap = {
  Award,
  BadgeMinus,
  CircleOff,
  Crown,
  Gauge,
  Layers3,
  Medal,
  Shield,
  Sparkles,
  Star,
  ThumbsUp,
  TriangleAlert,
};

export const DynamicIcon = ({ name, ...props }) => {
  const Icon = iconMap[name] || Star;
  return <Icon {...props} />;
};
