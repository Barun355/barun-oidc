import * as cryptoUtils from "../../common/utils/crypto";
import ApiResponse from "../../common/utils/api-response";
import { prisma } from "../../common/utils/prisma";
const verifyClientId = async function (req, res, next) {
    const { clientId } = req.query;
    if (!clientId || typeof clientId !== "string") {
        return ApiResponse.html(res, "unauthorized.html", "error");
    }
    const hashedClientId = await cryptoUtils.hashContent(clientId);
    const existingClient = await prisma.client.findFirst({
        where: {
            clientId: hashedClientId
        },
        select: {
            id: true,
            applicationName: true,
            redirectUrl: true,
        }
    });
    if (!existingClient?.id) {
        return ApiResponse.html(res, "unauthorized.html", "error");
    }
    req.clientInfo = {
        clientId,
        clientTableEntryId: existingClient.id,
        applicationName: existingClient.applicationName,
        redirectUrl: existingClient.redirectUrl,
    };
    next();
};
export { verifyClientId };
//# sourceMappingURL=middleware.js.map