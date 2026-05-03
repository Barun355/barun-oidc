class ApiResponse {
    static ok(res, message, data) {
        return res.status(200).json({
            success: true,
            code: "OK",
            status: 200,
            message,
            data,
        });
    }
    static created(res, message, data) {
        return res.status(201).json({
            success: true,
            code: "CREATED",
            status: 201,
            message,
            data,
        });
    }
    static html(res, html, type = "success") {
        res.setHeader("Content-Type", "text/html");
        if (type === "error")
            return res.status(400).sendFile(html, { root: "public" });
        else
            return res.status(200).sendFile(html, { root: "public" });
    }
}
export default ApiResponse;
//# sourceMappingURL=api-response.js.map