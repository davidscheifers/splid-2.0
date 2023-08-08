import { APIGatewayEvent } from 'aws-lambda';
//import { getGroups } from './groups/getGroups'
import { HttpMethod } from 'aws-cdk-lib/aws-events';
import { create } from 'domain';

const createResponse = (code:number, body: any) => {
    return {
        statusCode: code,
        headers: { 'Content-Type': 'application/json'},
        isBase64Encoded: false,
        body: JSON.stringify(body),
    };
}

export const handler = async (event:APIGatewayEvent) => {
    const { resource, httpMethod, pathParameters, body } = event;
    
    const getNameFromBody = () => {
        const parsedBody = JSON.parse(body as string);
        return parsedBody.name;
    }

    const getParam = () => {
        if(pathParameters?.param) return pathParameters?.param;
        return false;
    }

    switch (resource) {
        case '/v1/secure/groups': { 
            if(httpMethod === 'GET'){
                try{
                    //const groups = await getGroups();
                    //console.log(groups);
                    return createResponse(200, 'you got in /v1/secured/groups');
                }
                catch(error){
                    return createResponse(500, { result: 'Error getting groups'});
                }

            }
            return createResponse(405, { result: `${httpMethod} method not allowed on this resource.`});
        }

        // case '/v1/secure': { 
        //     if ( httpMethod === 'POST') {
        //         const name = getNameFromBody();
        //         return createResponse(200, { result: `${httpMethod} on secure resource with name: ${name} was successful!`});
        //     }
        //     return createResponse(200, { result: `${httpMethod} on secure resource was successful!`});
        // }

        // case '/v1/secure/{param}': {
        //     if ( httpMethod === 'PATCH') {
        //         const param = getParam();
        //         const name = getNameFromBody();
        //         return createResponse(200, { result: `${httpMethod} on secure resource with param: ${param} and name: ${name} was successful!`});
        //     }
        //     const param = getParam();
        //     return createResponse(200, { result: `${httpMethod} on secure resource with param: ${param} was successful!`});
        // }

        default : {
            return createResponse(500, { result: 'Error: Resource was not found!'});
        }
    }
};