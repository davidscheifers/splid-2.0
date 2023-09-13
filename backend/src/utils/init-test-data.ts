import { APIGatewayProxyHandler, Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { createResponse } from '../utils/response-utils';
import { initSQL } from './initSQL';

export const handler: Handler = async (event: any) => {
    let dataSource;

    try {
        console.log('init-test-data lambda starts here');

        dataSource = await instantiateRdsClient();
        
        await dataSource.query(initSQL);

        return createResponse(200, 'Successfully added test data');

    } catch (error) {
        console.error('Error running init sql queries:', error);
        return createResponse(500, 'Error running init sql queries.');
      }finally{
        if(dataSource){
          await dataSource.destroy();
          console.log('Database connection closed.')
        }
      }
};
