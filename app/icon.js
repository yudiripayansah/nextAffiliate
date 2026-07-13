import { ImageResponse } from "next/og";
import { brandIconStyle } from "@/utils/brandIcon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<div style={brandIconStyle(20)}>✦</div>, size);
}
