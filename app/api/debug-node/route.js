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
    const req = createRequire(process.cwd() + "/node_modules/jwks-rsa/package.json");
    const jose = req("jose");
    info.requireJoseAsJwksRsa = "ok: importJWK=" + typeof jose.importJWK;
  } catch (error) {
    info.requireJoseAsJwksRsa = `fail [${error.code}]: ${String(error.message).slice(0, 200)}`;
  }

  return Response.json(info);
}
