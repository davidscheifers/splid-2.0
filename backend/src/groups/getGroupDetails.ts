import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { createResponse } from "../utils/response-utils";

// Definiert die Lambda-Handler-Funktion
export const handler: Handler = async (event: any) => {
  let dataSource;
  // Pfadstruktur: /users/userid/

  try {
    // Lambda-Funktion startet
    console.log("getGroupDetails lambda starts here");

    // Datenbankverbindung wird hergestellt
    dataSource = await instantiateRdsClient();

    // Repository für Gruppen wird abgerufen
    console.log("getting groups from db");
    const groupRepository = dataSource.getRepository(Group);

    // Gruppen-ID wird aus den Pfadparametern des Events extrahiert
    const groupId: string = event.pathParameters.groupId;

    // Gruppendaten werden aus der Datenbank abgerufen
    const group = await groupRepository.findOne({
      where: { id: groupId },
      relations: ["users", "accountings"], // Beziehungen können mithilfe der Relationen abgerufen werden
    });

    // Erfolgreiche Antwort mit den abgerufenen Gruppendaten wird erstellt
    console.log("Successfully retrieved group.");
    console.log(group);

    return createResponse(200, group);
  } catch (error) {
    // Fehlerbehandlung
    console.error("Error getting group:", error);
    return createResponse(500, "Cannot get group.");
  } finally {
    // Datenbankverbindung wird geschlossen, falls vorhanden
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
