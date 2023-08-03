import { DataSource } from 'typeorm';
import { SecretsManager } from 'aws-sdk';
import { Group } from '../models/group'; // Import your entity

const CREDENTIALS_ARN = process.env.CREDENTIALS_ARN!;
const HOST = process.env.HOST!;

const secrets = new SecretsManager();

export const instantiateRdsClient = async (): Promise<DataSource> => {
  console.log('retrieving spliddb credentials...');
  const credentialsSecret = await secrets.getSecretValue({ SecretId: CREDENTIALS_ARN }).promise();
  const credentials = JSON.parse(credentialsSecret.SecretString as string);

  console.log('instantiating rds client...');
  const dataSource = new DataSource({
    type: 'postgres',
    host: HOST,
    port: 5432,
    username: credentials.user,
    password: credentials.password,
    database: 'spliddb',
    entities: [Group], // Add all your entities here
    synchronize: false, // Set to true if you want TypeORM to automatically create the database schema
  });

  await dataSource.initialize();

  return dataSource;
};



// import { SecretsManager } from 'aws-sdk';
// import { Client } from 'pg';

// const CREDENTIALS_ARN = process.env.CREDENTIALS_ARN!;
// const HOST = process.env.HOST!;

// const secrets = new SecretsManager();

// export const instantiateRdsClient = async () => {

//     // Retrieve RDS User credentials
//     console.log('retrieving spliddb credentials...');
//     const credentialsSecret = await secrets.getSecretValue({ SecretId: CREDENTIALS_ARN }).promise();
//     const credentials = JSON.parse(credentialsSecret.SecretString as string);

//     // Instantiate RDS Client
//     console.log('instantiating rds client...');
//     const client = new Client({
//         host: HOST,
//         user: credentials.user,
//         password: credentials.password,
//         database: 'spliddb',
//         port: 5432,
//     });

//     //Connect to RDS instance
//     console.log('connecting to rds...');
//     await client.connect();

//     return client;

// }






