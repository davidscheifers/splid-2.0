import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Accounting } from "../models/accounting"; // Stellen Sie sicher, dass Sie den richtigen Pfad zum Accounting-Modell angeben

export const deleteAccounting: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const accountingRepository = dataSource.getRepository(Accounting);

    // Überprüfen, ob der "accountingId" Parameter in der Event-Payload vorhanden ist
    const accountingId = event?.accountingId;
    if (!accountingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Ungültige Anforderungsdaten. "accountingId" fehlt.',
        }),
      };
    }

    // Suchen des Accounting-Datensatzes in der Datenbank anhand der gegebenen accountingId
    const accounting = await accountingRepository.findOne(accountingId);
    if (!accounting) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Accounting-Datensatz wurde nicht gefunden.",
        }),
      };
    }

    // Accounting-Datensatz aus der Datenbank löschen
    await accountingRepository.remove(accounting);

    // Schließen Sie die Verbindung, wenn Sie fertig sind
    await dataSource.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Accounting-Datensatz erfolgreich gelöscht.",
        deletedAccounting: accounting,
      }),
    };
  } catch (error) {
    console.error("Fehler beim Löschen des Accounting-Datensatzes:", error);
    throw error;
  }
};
