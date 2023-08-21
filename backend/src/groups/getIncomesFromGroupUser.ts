import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Transaction } from "../models/transaction";
import { MoreThan } from "typeorm";
import { createResponse } from "../utils/response-utils";

// Definiere die Lambda-Handler-Funktion
export const handler: Handler = async (event: any) => {
  let dataSource;
  //Pfadstruktur: /groups/groupid/users/userid/income

  try {
    // Lambda-Funktion startet
    console.log("getIncomeFromGroupUser lambda starts here");

    // Datenbankverbindung wird hergestellt
    dataSource = await instantiateRdsClient();

    // Repository für Transaktionen wird abgerufen
    const transactionRepository = dataSource.getRepository(Transaction);

    // Gruppen-ID und Benutzername werden aus den Pfadparametern des Events extrahiert
    const groupId: string = event.pathParameters.groupId;
    const username: string = event.pathParameters.username;

    // Einkommenstransaktionen werden aus der Datenbank abgerufen
    const transactions = await transactionRepository.find({
      where: {
        group: { id: groupId },
        receiver: { username: username },
        amount: MoreThan(0), // Nur Einkommen wird abgefragt (positive Beträge)
      },
    });

    // Erfolgreiche Antwort mit den abgerufenen Transaktionen wird erstellt
    return createResponse(200, transactions);
  } catch (error) {
    // Fehlerbehanldung
    console.error("Error fetching transactions:", error);
    return createResponse(500, "Cannot fetch transactions.");
  } finally {
    // Datenbankverbindung wird geschlossen, falls vorhanden
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
