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

Cypress.Commands.add("loadGroup", () => {
    cy.intercept(
        "GET",
        `${api}/prod/api/secure/Groups/5aa66f64-5717-4562-b3fc-2c963f66afa6/details`,

        {
            name: "Bella Italia",
            picturePath: "/GroupPictures/bella_italia.jpeg",
            description: "Italien Urlaub Gruppe",
            createdBy: "max",
            createdAt: "2022-01-12T00:00:00.000Z",
            updatedAt: "2023-09-14T15:38:19.064Z",
            id: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
            users: [
                {
                    username: "admin",
                    password:
                        "$2b$10$u7rRiUYTt5x.zFrP5.SrwOGP7eX.FLhhM4JD6Z0VnaShR4o0qIj2e",
                    mail: "admin@mail.com",
                    number: "01456",
                },
                {
                    username: "max",
                    password:
                        "$2b$10$u7rRiUYTt5x.zFrP5.SrwOGP7eX.FLhhM4JD6Z0VnaShR4o0qIj2e",
                    mail: "maxmustermann@mail.com",
                    number: "007",
                },
                {
                    username: "tester",
                    password:
                        "$2b$10$u7rRiUYTt5x.zFrP5.SrwOGP7eX.FLhhM4JD6Z0VnaShR4o0qIj2e",
                    mail: "tester@mail.com",
                    number: "0815",
                },
            ],
            accountings: [
                {
                    username: "max",
                    balance: 46.315,
                    groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
                },
                {
                    username: "tester",
                    balance: 0,
                    groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
                },
                {
                    username: "admin",
                    balance: -46.31499999999998,
                    groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
                },
            ],
        }
    ).as("loadGroup");
});

Cypress.Commands.add("loadBalance", () => {
    cy.intercept(
        "GET",
        `${api}/prod/api/secure/Accounting/5aa66f64-5717-4562-b3fc-2c963f66afa6`,
        [
            {
                username: "max",
                balance: 46.315,
                groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
            },
            {
                username: "tester",
                balance: 0,
                groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
            },
            {
                username: "admin",
                balance: -46.31499999999998,
                groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
            },
        ]
    ).as("loadBalance");
});

Cypress.Commands.add("loadTransactions", () => {
    cy.intercept(
        "GET",
        `${api}/prod/api/secure/Groups/5aa66f64-5717-4562-b3fc-2c963f66afa6/transactions`,
        [
            {
                id: "705db27c-998e-11ed-a8fc-0242ac120002",
                description: "Payment",
                amount: -36.65,
                createdAt: "2022-02-01T18:00:01.000Z",
                senderUsername: "tester",
                receiverUsername: "admin",
                groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
            },
            {
                id: "705db150-998e-11ed-a8fc-0242ac120002",
                description: "Payment",
                amount: 36.65,
                createdAt: "2022-02-01T18:00:01.000Z",
                senderUsername: "tester",
                receiverUsername: "tester",
                groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
            },
        ]
    ).as("loadTransactions");
});

Cypress.Commands.add("createTransaction", () => {
    cy.intercept("POST", `${api}/prod/api/secure/Transactions`, [
        {
            id: "705db27c-998e-11ed-a8fc-0242ac120002",
            description: "Payment",
            amount: -36.65,
            createdAt: "2022-02-01T18:00:01.000Z",
            senderUsername: "tester",
            receiverUsername: "admin",
            groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
        },
        {
            id: "705db150-998e-11ed-a8fc-0242ac120002",
            description: "Payment",
            amount: 36.65,
            createdAt: "2022-02-01T18:00:01.000Z",
            senderUsername: "tester",
            receiverUsername: "tester",
            groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
        },
    ]).as("createTransaction");
});

Cypress.Commands.add("loadUsers", () => {
    cy.intercept(
        "GET",
        `${api}/prod/api/secure/Accounting/5aa66f64-5717-4562-b3fc-2c963f66afa6`,
        [
            {
                username: "max",
                balance: 46.315,
                groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
            },
            {
                username: "tester",
                balance: 0,
                groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
            },
            {
                username: "admin",
                balance: -46.31499999999998,
                groupId: "5aa66f64-5717-4562-b3fc-2c963f66afa6",
            },
        ]
    ).as("loadUsers");
});
