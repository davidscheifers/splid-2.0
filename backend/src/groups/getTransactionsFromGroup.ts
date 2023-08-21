import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Transaction } from "../models/transaction";
import { MoreThan } from "typeorm";
import { createResponse } from "../utils/response-utils";

// Definiere die Lambda-Handler-Funktion
export const handler: Handler = async (event: any) => {
  let dataSource;
  //Pfadstruktur: /groups/groupid/transactions

  try {
    // Lambda-Funktion startet
    console.log("getIncomeFromGroupUser lambda starts here");

    // Datenbankverbindung wird hergestellt
    dataSource = await instantiateRdsClient();

    // Repository für Transaktionen wird abgerufen
    const transactionRepository = dataSource.getRepository(Transaction);

    // Gruppen-ID wird aus den Pfadparametern des Events extrahiert
    const groupId: string = event.pathParameters.groupId;

    // Transaktionen für die Gruppe werden aus der Datenbank abgerufen
    const transactions = await transactionRepository.find({
      where: {
        groupId: groupId, // Nur Transaktionen mit der angegebenen Gruppen-ID
      },
      order: {
        createdAt: "DESC", // Transaktionen werden nach Erstellungszeitpunkt absteigend sortiert
        id: "DESC", // Bei gleichen Erstellungszeitpunkten wird nach ID absteigend sortiert
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
