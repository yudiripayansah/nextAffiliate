import { ImageResponse } from "next/og";
import { brandIconStyle } from "@/utils/brandIcon";

export async function GET() {
  return new ImageResponse(<div style={brandIconStyle(110)}>✦</div>, {
    width: 192,
    height: 192,
  });
}
