import { Handler } from 'aws-lambda';
import { SecretsManager } from 'aws-sdk';
import { Client } from 'pg';
import { instantiateRdsClient } from '../utils/db-connection';
import { uuid } from 'aws-sdk/clients/customerprofiles';

const CREDENTIALS_ARN = process.env.CREDENTIALS_ARN!;
const HOST = process.env.HOST!;

const secrets = new SecretsManager();

interface IAddEvent {
    id: uuid,
    name: string,
    picture_path: string,
    description: string,
    created_by: string,
    created_at: Date,
    updated_at: Date,
}

export const handler: Handler = async (event: IAddEvent) => {

    let client: Client;

    try {
        //instantiate the database client
        client = await instantiateRdsClient();

        console.log('getting groups');
        const query = await client.query('SELECT * FROM "Group" LIMIT 10');
        console.log(query.rows);
        
        // Break connection
        console.log('tasks completed!');
        await client.end();
        
    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    }
};