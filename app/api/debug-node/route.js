import { createRequire } from "node:module";

export async function GET() {
  const info = {
    node: process.version,
    execArgv: process.execArgv,
    env: {
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? null,
      VERCEL_REGION: process.env.VERCEL_REGION ?? null,
    },
  };

  try {
    const req = createRequire(process.cwd() + "/package.json");
    const jose = req("jose");
    info.requireJose = "ok: " + typeof jose.SignJWT;
  } catch (error) {
    info.requireJose = `fail [${error.code}]: ${String(error.message).slice(0, 200)}`;
  }

  return Response.json(info);
}
