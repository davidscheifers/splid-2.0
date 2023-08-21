import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { User } from "../models/user";
import { createReadStream } from "fs";
import { createResponse } from "../utils/response-utils";
import { create } from "domain";

// Definiere die Lambda-Handler-Funktion
export const handler: Handler = async (event: any) => {
  let dataSource;
  //Query-Parameter: searchTerm=test&username=TestUser

  try {
    // Lambda-Funktion startet
    console.log("searchGroupOfUsers lambda starts here");

    // Datenbankverbindung wird hergestellt
    dataSource = await instantiateRdsClient();

    // Repository für Benutzer wird abgerufen
    console.log("getting users from db");
    const userRepository = dataSource.getRepository(User);

    // Benutzername und Suchbegriff werden aus den Query-Parametern des Events extrahiert
    const username: string = event.queryStringParameters?.username;
    const searchTerm: string = event.queryStringParameters?.searchTerm;

    // Validierung der erforderlichen Parameter
    if (searchTerm === null || username === null) {
      return createResponse(400, "Missing search term or username.");
    }

    // Benutzer wird aus der Datenbank abgerufen
    const user = await userRepository.findOne({
      where: { username: username },
      relations: ["groups"],
    });

    // Falls der Benutzer nicht gefunden wurde, wird eine Fehlerantwort erstellt
    if (user === null) {
      return createResponse(404, "User not found.");
    }

    // Suchergebnis: Gruppen des Benutzers, die den Suchbegriff enthalten
    const searchResult = user.groups.filter((g) =>
      g.name.trim().toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    // Erfolgreiche Antwort mit dem Suchergebnis wird erstellt
    return createResponse(200, searchResult);
  } catch (error) {
    // Fehlerbehandlung
    console.error("Error searching groups:", error);
    return createResponse(500, "Cannot search groups.");
  } finally {
    // Datenbankverbindung wird geschlossen, falls vorhanden
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
