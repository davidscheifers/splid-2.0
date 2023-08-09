import { Handler } from "aws-lambda";
import { In } from "typeorm";
import { instantiateRdsClient } from "../utils/db-connection";
import { Accounting } from "../models/accounting"; // Stellen Sie sicher, dass Sie den richtigen Pfad zum Accounting-Modell angeben

export const getAccountingFromGroup: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const accountingRepository = dataSource.getRepository(Accounting);

    // Überprüfen, ob der "groupId" Parameter in der Event-Payload vorhanden ist
    const groupId = event?.groupId;
    if (!groupId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Ungültige Anforderungsdaten. "groupId" fehlt.',
        }),
      };
    }

    // Suchen aller Accounting-Datensätze in der Datenbank, die zur gegebenen groupId gehören
    const accountingFromGroup = await accountingRepository.find({
      where: { groupId },
    });
    if (accountingFromGroup.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message:
            "Es wurden keine Accounting-Datensätze für diese Gruppe gefunden.",
        }),
      };
    }

    // Schließen Sie die Verbindung, wenn Sie fertig sind
    await dataSource.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Accounting-Datensätze für die Gruppe gefunden.",
        accounting: accountingFromGroup,
      }),
    };
  } catch (error) {
    console.error(
      "Fehler beim Abrufen der Accounting-Datensätze für die Gruppe:",
      error
    );
    throw error;
  }
};
