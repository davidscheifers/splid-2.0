const api = `${Cypress.env("apiUrl")}`;

Cypress.Commands.add("loadGroups", () => {
    cy.intercept("GET", `${api}/prod/api/secure/User/admin/groups`, [
        {
            id: "1",
            name: "Group 1",
            picturePath: "https://picsum.photos/200",
            description: "Group 1 description",
            createdAt: "2021-01-01T00:00:00.000Z",
            createdBy: "admin",
            updatedAt: "2021-01-01T00:00:00.000Z",
        },
        {
            id: "2",
            name: "Group 2",
            picturePath: "https://picsum.photos/200",
            description: "Group 2 description",
            createdAt: "2021-01-01T00:00:00.000Z",
            createdBy: "admin",
            updatedAt: "2021-01-01T00:00:00.000Z",
        },
    ]).as("loadGroups");
});
