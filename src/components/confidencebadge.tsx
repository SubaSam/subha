// components/ConfidenceBadge.tsx
import { Badge } from "@/components/ui/badge";

interface Props {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: Props) {
  let className = "p-0.5 text-xs rounded-md ";

  if (confidence > 0.5) {
    className += "bg-[#0B6058] text-[#5AB4B2]";
  } else if (confidence < 0.5) {
    className += "bg-[#8E6B74] text-[#83263A]";
  } else {
    className += "bg-[#86713D] text-[#F7CB9B]";
  }

  return <Badge className={className}>{confidence.toFixed(2)}</Badge>;
}
