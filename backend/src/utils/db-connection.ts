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




