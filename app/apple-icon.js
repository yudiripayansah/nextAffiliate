import { ImageResponse } from "next/og";
import { brandIconStyle } from "@/utils/brandIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<div style={brandIconStyle(104)}>✦</div>, size);
}
