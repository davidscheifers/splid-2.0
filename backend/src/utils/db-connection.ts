import { DataSource } from 'typeorm';
import { SecretsManager } from 'aws-sdk';
import { Group } from '../models/group'; 
import { Accounting } from '../models/accounting'; 
import { Bill } from '../models/bill'; 
import { Transaction } from '../models/transaction'; 
import { User } from '../models/user'; 

const RDS_ARN = process.env.RDS_ARN!;

const secrets = new SecretsManager();

export const instantiateRdsClient = async (): Promise<DataSource> => {
  
  console.log('retrieving spliddb credentials...');
  console.log('CREDENTIALS_ARN: ', RDS_ARN);

  console.log(await secrets.getSecretValue({ SecretId: RDS_ARN }).promise());
  const credentialsSecret = await secrets.getSecretValue({ SecretId: RDS_ARN }).promise();
  const credentials = JSON.parse(credentialsSecret.SecretString as string);

  console.log('credentials: ', credentials.username, credentials.password, credentials.host);

  console.log('instantiating rds client...');
  const dataSource = new DataSource({
    type: 'postgres',
    host: credentials.host,
    port: 5432,
    username: credentials.username,
    password: credentials.password,
    database: 'postgres',
    schema: 'splid',
    entities: [Group, Accounting, Bill, Transaction, User], // List of entities to load needed?
    synchronize: false,
  });

  await dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

  return dataSource;
};




