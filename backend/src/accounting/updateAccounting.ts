import { Handler } from "aws-lambda";
import { In } from "typeorm";
import { instantiateRdsClient } from "../utils/db-connection";
import { Accounting } from "../models/accounting"; // Stellen Sie sicher, dass Sie den richtigen Pfad zum Accounting-Modell angeben

export const updateAccounting: Handler = async (event: any) => {
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

    // Suchen des zu aktualisierenden Accounting-Datensatzes in der Datenbank anhand der gegebenen accountId
    const accounting = await accountingRepository.findOne(accountId);
    if (!accounting) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Accounting-Datensatz wurde nicht gefunden.",
        }),
      };
    }

    // Überprüfen, ob es Aktualisierungsdaten im Request gibt
    const updateData = event?.updateData;
    if (!updateData) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Ungültige Anforderungsdaten. "updateData" fehlt.',
        }),
      };
    }

    // Aktualisieren des Accounting-Datensatzes mit den neuen Daten
    if (updateData.username) {
      accounting.username = updateData.username;
    }
    if (updateData.balance) {
      accounting.balance = updateData.balance;
    }
    // Weitere Felder können entsprechend aktualisiert werden

    // Accounting-Datensatz in die Datenbank speichern
    await accountingRepository.save(accounting);

    // Schließen Sie die Verbindung, wenn Sie fertig sind
    await dataSource.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Accounting-Datensatz erfolgreich aktualisiert.",
        updatedAccounting: accounting,
      }),
    };
  } catch (error) {
    console.error(
      "Fehler beim Aktualisieren des Accounting-Datensatzes:",
      error
    );
    throw error;
  }
};
