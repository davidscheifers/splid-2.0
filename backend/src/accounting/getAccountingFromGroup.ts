import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Accounting } from "../models/accounting"; // Stellen Sie sicher, dass Sie den richtigen Pfad zum Accounting-Modell angeben
import { createResponse } from "../utils/response-utils";

export const handler: Handler = async (event: any) => {
  let dataSource;
  //path /Accounting/groupid

  try {
    console.log("getAccountingFromGroup lambda starts here");

    dataSource = await instantiateRdsClient();
    const accountingRepository = dataSource.getRepository(Accounting);

    // Überprüfen, ob der "groupId" Parameter in der Event-Payload vorhanden ist
    const groupId = event.pathParameters.groupId;
    if (!groupId) {
      return createResponse(400, "groupId ist erforderlich.");
    }

    console

    // Suchen aller Accounting-Datensätze in der Datenbank, die zur gegebenen groupId gehören
    const accountingFromGroup = await accountingRepository.find({
      where: { groupId },
    });
    if (accountingFromGroup.length === 0) {
      return createResponse(404, "Keine Accounting-Datensätze gefunden.");
    }
    
    return createResponse(200, accountingFromGroup);

  } catch (error) {
    console.error("Fehler beim Abrufen der Accounting-Datensätze für die Gruppe:",error);
    return createResponse(500, "Kann Accounting-Datensätze nicht abrufen.");
  }finally{
    if(dataSource){
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
