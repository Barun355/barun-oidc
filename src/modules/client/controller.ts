import type { Request, Response } from "express";
import { prisma } from "../../common/utils/prisma.ts";
import ApiResponse from "../../common/utils/api-response.ts";
import ApiError from "../../common/utils/api-error.ts";
import * as cryptoUtils from "../../common/utils/crypto.ts";

export const getRegister = async (req: Request, res: Response) => {
  return ApiResponse.html(res, "client-register.html");
};

export const registerClientApp = async (req: Request, res: Response) => {
  const {
    applicationDescription,
    applicationName,
    applicationUrl,
    redirectUrl,
  } = req.body;

  if (
    !applicationDescription ||
    !applicationName ||
    !applicationUrl ||
    !redirectUrl
  ) {
    throw ApiError.badRequest("All fields are required");
  }

  const existingClient = await prisma.client.findFirst({
    where: {
      applicationName,
      OR: [
        { applicationUrl },
        { redirectUrl },
      ],
    },
    select: {
      id: true,
    }
  })

  if (existingClient) {
    throw ApiError.conflict("Client with the same application name, URL or redirect URL already exists")
  }

  const { token: clientId, hashedToken: hashedClientId } = await cryptoUtils.generateHash()
  const { token: clientSecret, hashedToken: hashedClientSecret } = await cryptoUtils.generateHash()

  const client = await prisma.client.create({
    data: {
      applicationDescription,
      applicationName,
      applicationUrl,
      redirectUrl,
      clientId: hashedClientId,
      clientSecret: hashedClientSecret,
    },
    omit: {
      clientId: true,
      clientSecret: true,
    }
  });


  console.log('Client App Register', client)

  return ApiResponse.created(res, "App created successfully", { ...client, clientId, clientSecret });

};
