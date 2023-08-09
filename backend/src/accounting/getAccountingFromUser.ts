import { Handler } from "aws-lambda";
import { In } from "typeorm";
import { instantiateRdsClient } from "../utils/db-connection";
import { Accounting } from "../models/accounting"; // Stellen Sie sicher, dass Sie den richtigen Pfad zum Accounting-Modell angeben

export const getAccountingFromUser: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const accountingRepository = dataSource.getRepository(Accounting);

    // Überprüfen, ob der "username" Parameter in der Event-Payload vorhanden ist
    const username = event?.username;
    if (!username) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Ungültige Anforderungsdaten. "username" fehlt.',
        }),
      };
    }

    // Suchen aller Accounting-Datensätze in der Datenbank, die zum gegebenen Benutzer gehören
    const accountingFromUser = await accountingRepository.find({
      where: { username },
    });
    if (accountingFromUser.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message:
            "Es wurden keine Accounting-Datensätze für diesen Benutzer gefunden.",
        }),
      };
    }

    // Schließen Sie die Verbindung, wenn Sie fertig sind
    await dataSource.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Accounting-Datensätze für den Benutzer gefunden.",
        accounting: accountingFromUser,
      }),
    };
  } catch (error) {
    console.error(
      "Fehler beim Abrufen der Accounting-Datensätze für den Benutzer:",
      error
    );
    throw error;
  }
};
