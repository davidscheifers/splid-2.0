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

        console.log('adding group...');
        const queryText = `INSERT INTO "Group" (id, name, picture_path, description, created_by, created_at, updated_at) 
        VALUES($1, $2, $3, $4, $5, $6, $7)`;

        const queryValues = [event.id, event.name, event.picture_path, event.description, event.created_by, event.created_at, event.updated_at];

        await client.query(queryText, queryValues);

        // Break connection
        console.log('tasks completed!');
        await client.end();
        
    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    }
};