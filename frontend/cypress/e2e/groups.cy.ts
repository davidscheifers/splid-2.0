describe("Groups page", () => {
    it("successfully loads all groups admin user is in", () => {
        cy.visit("http://localhost:5173/groups");
        cy.loadGroups();

        cy.get("h1").should("contain", "Gruppen");
        cy.get('[data-cy="group-teaser"]').should("have.length", 2);
    });
});
