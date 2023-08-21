import { Handler } from "aws-lambda";
import { In } from "typeorm";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { User } from "../models/user";
import { createResponse } from "../utils/response-utils";

// Definiert die Lambda-Handler-Funktion
export const handler: Handler = async (event: any) => {
  let dataSource;
  //request body: multipart/form-data
  // string($uuid)
  // Name
  // string
  // Description
  // string
  // Users
  // array
  // Picture
  // string($binary)

  try {
    // Lambda-Funktion startet
    console.log("addGroup lambda starts here");

    // Datenverbindung wird hergestellt
    dataSource = await instantiateRdsClient();

    // Datenbank-Repositories für Group und User werden abgerufen
    console.log("getting groups and User from db");
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    // Eingabedaten für die Gruppe werden aus dem Event-Objekt geparst
    const inputGroup: Group = JSON.parse(event.body);

    // Validierung der erforderlichen Felder
    if (inputGroup.name === null || inputGroup.createdBy === null) {
      return createResponse(
        400,
        "Cannot create group. Missing required fields."
      );
    }

    // ID und Zeitstempel werden vorbereitet
    inputGroup.id = ""; // new UUID? oder macht das das TypeORM Automatisch?
    inputGroup.createdAt = new Date(Date.now());
    inputGroup.updatedAt = new Date(Date.now());

    // Array für Benutzernamen wird erstellt
    const usernames = new Array<string>();

    // Extrahieren der Benutzernamen aus den Eingabedaten
    if (inputGroup.users == null) {
      usernames.push(inputGroup.createdBy);
    } else {
      usernames.push(...inputGroup.users.map((u) => u.username));
      if (!usernames.includes(inputGroup.createdBy)) {
        usernames.push(inputGroup.createdBy);
      }
    }

    // Benutzerdaten werden aus der Datenbank gespeichert
    inputGroup.users = await userRepository.find({
      where: { username: In(usernames) },
    });

    // Gruppendaten werden in der Datenbank gespeichert
    await groupRepository.save(inputGroup);

    // Datenbankverbindung wird geschlossen
    await dataSource.destroy();

    // Erfolgreiche Antwort wird erstellt
    return createResponse(200, inputGroup);

    // Fehlerbehandlung
  } catch (error) {
    console.error("Error adding group:", error);
    return createResponse(500, "Cannot add group.");
  } finally {
    // Datenbankverbindung wird geschlossen, falls vorhanden.
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
