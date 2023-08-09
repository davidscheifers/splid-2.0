import { Handler } from "aws-lambda";
import { In } from "typeorm";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { User } from "../models/user";
import { Accounting } from "../models/accounting"; // Stellen Sie sicher, dass Sie den richtigen Pfad zum Accounting-Modell angeben

export const addAccounting: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);
    const accountingRepository = dataSource.getRepository(Accounting);

    const inputAccounting = event.accounting;

    // Überprüfen Sie, ob die erforderlichen Daten im Request vorhanden sind
    if (
      !inputAccounting.username ||
      !inputAccounting.balance ||
      !inputAccounting.groupId
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Ungültige Anforderungsdaten" }),
      };
    }

    // Überprüfen, ob die angegebene Gruppe existiert
    const group = await groupRepository.findOne(inputAccounting.groupId);
    if (!group) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Die angegebene Gruppe existiert nicht",
        }),
      };
    }

    // Überprüfen, ob der angegebene Benutzer existiert
    const user = await userRepository.findOne({
      username: inputAccounting.username,
    });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Der angegebene Benutzer existiert nicht",
        }),
      };
    }

    // Erstellen eines neuen Accounting-Datensatzes
    const newAccounting = new Accounting();
    newAccounting.username = inputAccounting.username;
    newAccounting.balance = inputAccounting.balance;
    newAccounting.groupId = inputAccounting.groupId;
    newAccounting.group = group; // Die Many-to-One-Beziehung zur Gruppe setzen
    newAccounting.usernameNavigation = user; // Die Many-to-One-Beziehung zum Benutzer setzen

    // Accounting-Datensatz in die Datenbank speichern
    await accountingRepository.save(newAccounting);

    // Schließen Sie die Verbindung, wenn Sie fertig sind
    await dataSource.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Accounting erfolgreich hinzugefügt",
        accounting: newAccounting,
      }),
    };
  } catch (error) {
    console.error("Fehler beim Erstellen des Accounting-Datensatzes:", error);
    throw error;
  }
};
