const transactionUrl =
    "http://localhost:5173/groups/5aa66f64-5717-4562-b3fc-2c963f66afa6/expenses/create";

describe("create transaction page", () => {
    beforeEach(() => {
        cy.visit(transactionUrl);
        cy.loadUsers();
    });

    it("successfully loads the page", () => {
        cy.get("h1").should("contain", "Ausgabe erstellen");
    });

    it("successfully fills out all fields", () => {
        cy.get('[data-cy="expense-description"]')
            .type("Neue Ausgabe")
            .should("have.value", "Neue Ausgabe");
        cy.get('[data-cy="expense-amount"]')
            .type("1")
            .should("have.value", "0.001");
    });
});
