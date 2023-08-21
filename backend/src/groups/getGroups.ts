import { APIGatewayProxyHandler, Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { createResponse } from "../utils/response-utils";

// Definiere die Lambda-Handler-Funktion, die das APIGatewayProxyHandler-Interface verwendet
export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let dataSource;

  try {
    // Lambda-Funktion startet
    console.log("getGroups lambda starts here");

    // Datenbankverbindung wird hergestellt
    dataSource = await instantiateRdsClient();

    // Repository für Gruppen wird abgerufen
    console.log("getting groups from db");
    const groupRepository = dataSource.getRepository(Group);

    // Gruppen werden aus der Datenbank abgerufen
    const groups = await groupRepository.find({
      take: 10, // Begrenze die Anzahl der abgerufenen Gruppen auf 10
    });

    // Erfolgreiche Antwort mit den abgerufenen Gruppen wird erstellt
    console.log("Successfully retrieved groups.");
    console.log(groups);

    return createResponse(200, groups);
  } catch (error) {
    // Fehlerbehandlung
    console.error("Error getting groups:", error);
    return createResponse(500, "Error getting groups.");
  } finally {
    // Datenbankverbindung wird geschlossen, falls vorhanden
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
