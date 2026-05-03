import type { Request, Response } from "express";
import ApiResponse from "../../common/utils/api-response";
import path from "path";
import fs from "fs";
import { prisma } from "../../common/utils/prisma";
import ApiError from "../../common/utils/api-error";
import * as bcryptUtils from "../../common/utils/bcrypt";
import * as cryptoUtils from "../../common/utils/crypto";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY, PUBLIC_KEY } from "../../common/utils/cert";

const ISSUER = process.env.SERVER_URL;
interface JWTClaims {
  iss: string;
  sub: string;
  email: string;
  email_verified: string;
  exp: number;
  given_name: string;
  family_name: string;
  name: string;
  picture: string;
}

export const getSignIn = async (req: Request, res: Response) => {
  const loginHtmlPath = path.resolve("public", "signin.html");
  const loginHtml = fs.readFileSync(loginHtmlPath, "utf-8");
  const modifiedLoginHtml = loginHtml.replaceAll(
    "{application_name}",
    req.clientInfo?.applicationName!,
  );
  res.status(200).send(modifiedLoginHtml);
};

export const getSignUp = async (req: Request, res: Response) => {
  return ApiResponse.html(res, "signup.html");
};

export const generateToken = async (req: Request, res: Response) => {
  const { authorizationCode, clientSecret } = req.body;

  const hashedAuthorizationCode =
    await cryptoUtils.hashContent(authorizationCode);

  const userCodeEntry = await prisma.userCode.findFirst({
    where: {
      authorizationCode: hashedAuthorizationCode,
    },
  });

  if (!userCodeEntry?.id) {
    throw ApiError.unauthorized("Invalid or expired authorization code");
  }

  if (Date.now() > Number(userCodeEntry.authorizationCodeExpiresAt)) {
    throw ApiError.unauthorized("Authorization code has expired");
  }

  const hashedClientSecret = await cryptoUtils.hashContent(clientSecret);

  const clientEntry = await prisma.client.findFirst({
    where: {
      id: userCodeEntry.clientId,
      clientSecret: hashedClientSecret,
    },
  });

  if (!clientEntry?.id) {
    throw ApiError.unauthorized("Invalid client credentials");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userCodeEntry.userId,
    },
  });

  if (!user?.id) {
    throw ApiError.unauthorized("User not found");
  }

  const claims = {
    iss: ISSUER,
    sub: user.id,
    email: user.email,
    email_verified: String(user.isVerified),
    exp: Math.floor(Date.now() / 1000) + 15 * 60,
    given_name: user.firstName,
    family_name: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    picture: user.avatarUrl,
  };

  const accessToken = jwt.sign(claims, PRIVATE_KEY, { algorithm: "RS256" });

  const { token: refreshToken, hashedToken: hashedRefreshToken } =
    await cryptoUtils.generateHash();

  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const updatedUserCode = await prisma.userCode.update({
    where: {
      id: userCodeEntry.id,
      authorizationCode: hashedAuthorizationCode,
    },
    data: {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt,
    },
  });

  if (!updatedUserCode.id) {
    throw ApiError.internal("Failed to update user code");
  }

  return ApiResponse.ok(res, "Token generated", { accessToken, refreshToken });
};

export const getUserInfo = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) throw ApiError.unauthorized("Access token missing");
  let claims: JWTClaims;
  try {
    claims = jwt.verify(accessToken, PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as JWTClaims;
  } catch {
    throw ApiError.unauthorized("Invalid access token");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: claims.sub,
    },
  });

  if (!user) throw ApiError.notFound("User not found");
  const userInfo = {
    sub: user.id,
    email: user.email,
    email_verified: String(user.isVerified),
    given_name: user.firstName,
    family_name: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    picture: user.avatarUrl,
  };
  ApiResponse.ok(res, "User info retrieved successfully.", userInfo);
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken, clientSecret } = req.body;

  const hashedRefreshToken = await cryptoUtils.hashContent(refreshToken);
  const hashedClientSecret = await cryptoUtils.hashContent(clientSecret);
  const client = await prisma.client.findFirst({
    where: {
      clientSecret: hashedClientSecret,
    },
  });

  if (!client) throw ApiError.unauthorized("Invalid client secret");

  const userCodeEntry = await prisma.userCode.findFirst({
    where: {
      refreshToken: hashedRefreshToken,
      clientId: client.id,
    },
  });

  if (
    !userCodeEntry ||
    Date.now() > Number(userCodeEntry.refreshTokenExpiresAt)
  )
    throw ApiError.unauthorized("Invalid or expired refresh token");

  const user = await prisma.user.findFirst({
    where: {
      id: userCodeEntry.userId,
    },
  });

  if (!user) throw ApiError.notFound("User not found");

  const claims = {
    iss: ISSUER,
    sub: user.id,
    email: user.email,
    email_verified: String(user.isVerified),
    exp: Math.floor(Date.now() / 1000) + 15 * 60,
    given_name: user.firstName,
    family_name: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    picture: user.avatarUrl,
  };
  const accessToken = jwt.sign(claims, PRIVATE_KEY, { algorithm: "RS256" });
  const { token: newRefreshToken, hashedToken: hashedNewRefreshToken } =
    await cryptoUtils.generateHash();
  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await prisma.userCode.update({
    where: {
      id: userCodeEntry.id,
    },
    data: {
      refreshToken: hashedNewRefreshToken,
      refreshTokenExpiresAt,
    },
  });

  ApiResponse.ok(res, "Tokens refreshed successfully.", {
    accessToken,
    refreshToken: newRefreshToken,
  });
};

export const signInUser = async (req: Request, res: Response) => {
  const { clientId, clientTableEntryId } = req.clientInfo!;
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user?.id) {
    throw ApiError.unauthorized("User not found with this email");
  }

  const isPasswordValid = await bcryptUtils.compareHash(
    password,
    user?.password || "",
  );

  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const { token: authorizationCode, hashedToken: hashedAuthorizationCode } =
    await cryptoUtils.generateHash();

  const authorizationCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const userCode = await prisma.userCode.create({
    data: {
      clientId: clientTableEntryId,
      userId: user.id,
      authorizationCode: hashedAuthorizationCode,
      authorizationCodeExpiresAt,
    },
  });

  if (!userCode.id) {
    throw ApiError.internal("Failed to create authorization code");
  }

  const redirectUrl = `${req.clientInfo?.redirectUrl}?code=${authorizationCode}`;
  return res.redirect(redirectUrl);
  //   ApiResponse.ok(
  //     res,
  //     "Authorization code sent,Verify at /token endpoint to get access token and refresh token.",
  //     { redirectUrl },
  //   );
};

export const signUpUser = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    password,
    avatarUrl,
  } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser?.id) {
    throw ApiError.conflict("User with this email already exists");
  }

  const hashPassword = await bcryptUtils.hashContent(password);
  const { token, hashedToken } = await cryptoUtils.generateHash();

  const emailVerificationTokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashPassword,
      avatarUrl,
      dateOfBirth: new Date(dateOfBirth),
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt,
      gender,
    },
  });

  if (!newUser.id) {
    throw ApiError.badRequest("Failed to create user");
  }
  // await sendUserVerificationMail(token);

  return ApiResponse.ok(res, "User created");
};
