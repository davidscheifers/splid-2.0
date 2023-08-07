import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group';

const createResponse = (code:number, body: any) => {
  return {
      statusCode: code,
      headers: { 'Content-Type': 'application/json'},
      isBase64Encoded: false,
      body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    console.log('Go into the lambda!')
    dataSource = await instantiateRdsClient();
    console.log('getting groups');
    const groupRepository = dataSource.getRepository(Group);
    const groups = await groupRepository.find({ take: 10 }); //prepare object for return
    console.log(groups);

     // Close the connection when you're done
     await dataSource.destroy();

    return createResponse(200, groups);

  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};

// import { instantiateRdsClient } from '../utils/db-connection';
// import { Group } from '../models/group';

// export const getGroups = async () => {
//   let dataSource;

//   try {
//     dataSource = await instantiateRdsClient();
//     console.log('getting groups');
//     const groupRepository = dataSource.getRepository(Group);
//     const groups = await groupRepository.find({ take: 10 });
//     console.log(groups);

//      // Close the connection when you're done
//      await dataSource.destroy();

//     return groups;

//   } catch (error) {
//     console.error('Error creating database:', error);
//     throw error;
//   }
// };