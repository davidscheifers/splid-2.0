describe("Group page", () => {
    it("successfully loads", () => {
        //Go to the login page
        cy.visit("/groups");
        cy.loadGroups();
    });
});
