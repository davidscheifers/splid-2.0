export const createResponse = (code: number, body: any) => {
    return {
        statusCode: code,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
        body: JSON.stringify(body),
    };
};
