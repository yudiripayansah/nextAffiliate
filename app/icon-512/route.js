import { ImageResponse } from "next/og";
import { brandIconStyle } from "@/utils/brandIcon";

export async function GET() {
  return new ImageResponse(<div style={brandIconStyle(290)}>✦</div>, {
    width: 512,
    height: 512,
  });
}
