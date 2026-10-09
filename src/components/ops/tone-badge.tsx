import { Badge, type BadgeProps } from "@chakra-ui/react";
import type { ColorPalette } from "@chakra-ui/react";

interface ToneBadgeProps extends Omit<BadgeProps, "children"> {
  tone: { label: string; color: ColorPalette };
}

/** labels.ts의 상태 표기(라벨·색)를 배지로 그린다. */
export function ToneBadge({ tone, ...props }: ToneBadgeProps) {
  return (
    <Badge colorPalette={tone.color} variant="subtle" {...props}>
      {tone.label}
    </Badge>
  );
}
