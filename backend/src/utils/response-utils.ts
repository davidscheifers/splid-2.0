export const createResponse = (code: number, body: any) => {
    return {
        statusCode: code,
        headers: {
            'Content-Type': 'application/json',
            // allow CORS for all origins
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
            'Access-Control-Allow-Credentials': 'true', 
            'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
          },
        isBase64Encoded: false,
        body: JSON.stringify(body),
    };
};
