import { createResponse } from '@utils/response-utils';

describe('createResponse function', () => {
    
    test('should return an object with the given status code', () => {
        const response = createResponse(200, {});
        expect(response.statusCode).toBe(200);
    });

    test('should return an object with the stringified body', () => {
        const body = { message: 'Hello World' };
        const response = createResponse(200, body);
        expect(response.body).toBe(JSON.stringify(body));
    });

    test('should always return the same headers', () => {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
            'Access-Control-Allow-Credentials': 'true', 
            'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
        };
        const response = createResponse(200, {});
        expect(response.headers).toEqual(headers);
    });

    test('should always return isBase64Encoded as false', () => {
        const response = createResponse(200, {});
        expect(response.isBase64Encoded).toBe(false);
    });

});

