import { Handler } from "aws-lambda";
import { In } from "typeorm";
import { instantiateRdsClient } from "../utils/db-connection";
import { Accounting } from "../models/accounting"; // Stellen Sie sicher, dass Sie den richtigen Pfad zum Accounting-Modell angeben
import { User } from "../models/user";
import { Group } from "../models/group";

export const getAccountingDetails: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const accountingRepository = dataSource.getRepository(Accounting);

    // Überprüfen, ob der "accountId" Parameter in der Event-Payload vorhanden ist
    const accountId = event?.accountId;
    if (!accountId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Ungültige Anforderungsdaten. "accountId" fehlt.',
        }),
      };
    }

    // Suchen des Accounting-Datensatzes in der Datenbank anhand der gegebenen accountId
    const accounting = await accountingRepository.findOne(accountId, {
      relations: ["usernameNavigation", "group"],
    });
    if (!accounting) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Accounting-Datensatz wurde nicht gefunden.",
        }),
      };
    }

    // Schließen Sie die Verbindung, wenn Sie fertig sind
    await dataSource.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Accounting-Datensatz gefunden.",
        accounting,
      }),
    };
  } catch (error) {
    console.error(
      "Fehler beim Abrufen der Accounting-Datensatzdetails:",
      error
    );
    throw error;
  }
};
