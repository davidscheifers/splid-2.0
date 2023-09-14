const baseUrl =
    "http://localhost:5173/groups/5aa66f64-5717-4562-b3fc-2c963f66afa6/expenses";

describe("Group transactions page", () => {
    beforeEach(() => {
        cy.visit(baseUrl);
        cy.loadTransactions();
    });

    it("successfully loads a specific group overview", () => {
        cy.get("h1").should("contain", "Ausgaben");
    });

    it("shows correct amount of expenses", () => {
        cy.get('[data-cy="expense-teaser"]').should("have.length", 2);
    });

    it("shows correct name of expenses", () => {
        cy.get("h5").should("contain", "Payment");
    });
});
