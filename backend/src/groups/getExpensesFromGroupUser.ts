import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Transaction } from "../models/transaction";
import { LessThan } from "typeorm";
import { createResponse } from "../utils/response-utils";

// Definiert die Lambda-Handler-Funktion
export const handler: Handler = async (event: any) => {
  let dataSource;
  //Pfadstruktur: /groups/groupid/users/userid/expense

  try {
    // Lambda-Funktion startet
    console.log("getExpansesFromGroupUser lambda starts here");

    // Datenbankverbindung wird herstellt
    dataSource = await instantiateRdsClient();

    // Repository für Transaktionen wird abgerufen
    const transactionRepository = dataSource.getRepository(Transaction);

    // Gruppen-ID und Benutzername werden aus den Pfadparametern des Events extrahiert
    const groupId: string = event.pathParameters.groupId;
    const username: string = event.pathParameters.username;

    // Transaktionen werden aus der Datenbank abgerufen
    const transactions = await transactionRepository.find({
      where: {
        group: { id: groupId },
        receiver: { username: username },
        amount: LessThan(0), // Nur Ausgaben werden abgefragt (negative Beträge)
      },
    });

    // Erfolgreiche Antwort mit den abgerufenen Transaktionen wird erstellt
    return createResponse(200, transactions);
  } catch (error) {
    // Fehlerbehandlung
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
