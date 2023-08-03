import { SecretsManager } from 'aws-sdk';
import { Client } from 'pg';

const CREDENTIALS_ARN = process.env.CREDENTIALS_ARN!;
const HOST = process.env.HOST!;

const secrets = new SecretsManager();

export const instantiateRdsClient = async () => {

    // Retrieve RDS User credentials
    console.log('retrieving spliddb credentials...');
    const credentialsSecret = await secrets.getSecretValue({ SecretId: CREDENTIALS_ARN }).promise();
    const credentials = JSON.parse(credentialsSecret.SecretString as string);

    // Instantiate RDS Client
    console.log('instantiating rds client...');
    const client = new Client({
        host: HOST,
        user: credentials.user,
        password: credentials.password,
        database: 'spliddb',
        port: 5432,
    });

    //Connect to RDS instance
    console.log('connecting to rds...');
    await client.connect();

    return client;

}






