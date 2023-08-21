import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { User } from "../models/user";
import { createResponse } from "../utils/response-utils";

// Definiert die Lambda-Handler-Funktion
export const handler: Handler = async (event: any) => {
  let dataSource;
  // Pfadstruktur: Groups/uuid

  try {
    // Lambda-Funktion startet
    console.log("deleteGroup lambda starts here");

    // Datenbankverbindung wird hergestellt
    dataSource = await instantiateRdsClient();

    // Datenbank-Repositories für Group und User werden abgerufen
    console.log("getting groups and user from db");
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    // Die Gruppen-ID wird aus den Pfadparametern des Events extrahiert
    const groupId: string = event.pathParameters.groupId;

    console.log(groupId);

    // Die Gruppe mit zugehörigen Benutzern wird aus der Datenbank abgerufen
    const group = await groupRepository.findOne({
      where: { id: groupId },
      relations: ["users"],
    });

    // Falls die Gruppe nicht gefunden wurde, wird eine Fehlerantwort erstellt
    if (group === null) {
      return createResponse(500, "group not found");
    }

    // Alle Benutzer der Gruppe werden entfernt
    group.users = [];

    // Die modifizierte Gruppe wird in der Datenbank gespeichert und dann entfernt
    await groupRepository.save(group);
    await groupRepository.remove(group);

    // Erfolgreiche Antwort wird erstellt
    return createResponse(200, "group deleted");
  } catch (error) {
    // Fehlerbehandlung
    console.error("Error deleting group:", error);
    return createResponse(500, "Cannot delete group.");
  } finally {
    // Datenbankverbindung wird geschlossen, falls vorhanden
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
