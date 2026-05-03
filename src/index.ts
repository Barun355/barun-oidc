import express from "express";
import { PORT } from "./common/utils/constant.ts";
import cookieParser from "cookie-parser";
import jose from "node-jose"

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
  });
});

app.get("/", (req, res) => {
  return res.sendFile("index.html", { root: "public" });
});

import authRouter from "./modules/auth/router.ts";
import clientRouter from "./modules/client/router.ts";
import { PUBLIC_KEY } from "./common/utils/cert.ts";
import globalErrorHandler from "./common/middleware/globalErrorHandler.middleware.ts";

app.use("/clients", clientRouter);
app.use("/o/auth2/v2/auth", authRouter);

app.get("/.well-known/openid-configuration", (req, res) => {
  const baseUrl = process.env.SERVER_URL;
  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/o/auth2/v2/auth`,
    token_endpoint: `${baseUrl}/auth/token`,
    userinfo_endpoint: `${baseUrl}/auth/userinfo`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    registration_endpoint: `${baseUrl}/client/register`,
    scopes_supported: ["openid", "profile", "email"],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    token_endpoint_auth_methods_supported: ["client_secret_post"],
    claims_supported: [
      "sub",
      "iss",
      "email",
      "email_verified",
      "given_name",
      "family_name",
      "name",
      "picture",
    ],
    code_challenge_methods_supported: [],
  });
});

app.get("/.well-known/jwks.json", async (_, res) => {
  const key = await jose.JWK.asKey(PUBLIC_KEY, "pem");
  res.json({ keys: [key.toJSON()] });
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
