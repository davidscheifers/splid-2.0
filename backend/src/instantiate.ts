import { Handler } from 'aws-lambda';
import { SecretsManager } from 'aws-sdk';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const RDS_ARN = process.env.RDS_ARN!;
const CREDENTIALS_ARN = process.env.CREDENTIALS_ARN!;

const secrets = new SecretsManager();

export const handler: Handler = async () => {
    try {
        // Retrieve RDS Admin credentials
        console.log('retrieving admin credentials...');
        const adminSecret = await secrets.getSecretValue({ SecretId: RDS_ARN }).promise();
        const admin = JSON.parse(adminSecret.SecretString as string);

        // Retrieve RDS User credentials
        console.log('retrieving spliddb-user credentials...');
        const credentialsSecret = await secrets.getSecretValue({ SecretId: CREDENTIALS_ARN }).promise();
        const credentials = JSON.parse(credentialsSecret.SecretString as string);

        // Instantiate RDS Client with Admin
        console.log('instantiating client with admin...');
        const client = new Client({
            host: admin.host,
            user: admin.username,
            password: admin.password,
            database: 'postgres',
            port: 5432,
        });

        try {
            // Connect to RDS instance with Admin
            console.log('connecting to rds with admin...');
            await client.connect();
            console.log('setting up new database...');
            await client.query('CREATE DATABASE spliddb;');
            await client.query(`CREATE USER ${credentials.user} WITH PASSWORD '${credentials.password}';`);
            await client.query(`GRANT ALL PRIVILEGES ON DATABASE spliddb TO ${credentials.user};`);
            console.log('setup completed!');
          }catch {
            console.log('db already exist');
        }
          

        // Instantiate RDS Client with new user
        console.log('instantiating client with new user...');
        const userClient = new Client({
            host: admin.host,
            user: credentials.user,
            password: credentials.password,
            database: 'spliddb',
            port: 5432,
        });

        // Connect to RDS instance
        console.log('connecting to rds with new user...');
        await userClient.connect();

        //add init.sql script here -> ToDo: stack for s3 bucket

        //for testing just a simple Group Table:

        console.log('Creating table Group');
        const createTableCommand = [
            'CREATE TABLE IF NOT EXISTS "Group" (',
            'id UUID PRIMARY KEY NOT NULL,',
            'name CHARACTER VARYING(255) NOT NULL,',
            'picture_path CHARACTER VARYING(255),',
            'description CHARACTER VARYING(255),',
            'created_by CHARACTER VARYING NOT NULL,',
            'created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,',
            'updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL',
            ');',
        ]

        await userClient.query(createTableCommand.join(''))
        console.log('tasks completed!');
        await userClient.end();

    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    }
};
