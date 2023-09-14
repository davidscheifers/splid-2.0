const url = "http://localhost:5173/groups/5aa66f64-5717-4562-b3fc-2c963f66afa6";

describe("Group overview page", () => {
    beforeEach(() => {
        cy.visit(url);
        cy.loadGroup();
        cy.loadBalance();
    });

    it("successfully loads a specific group overview", () => {
        cy.get("h1").should("contain", "Bella Italia");
    });

    it("successfully shows users with current balance in group", () => {
        cy.get('[data-cy="balance-preview"]').should("have.length", 3);
        cy.get("h4").should(($h4) => {
            expect($h4).to.have.length(6);
            expect($h4.first()).to.contain("max");
            expect($h4.last()).to.contain("-46.31 €");
        });
    });

    it("successfully shows the correct group invitation code", () => {
        cy.get("h3").should("contain", "A9L B85 QXQ");
    });
});
