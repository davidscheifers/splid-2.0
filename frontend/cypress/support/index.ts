import "./commands";

/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to intercept loading groups
             * @loadGroups cy.loadGroups()
             */
            loadGroups(): void;
            /**
             * Custom command to intercept loading a group
             * @loadGroup cy.loadGroup()
             */
            loadGroup(): void;
            /**
             * Custom command to intercept loading the group balance
             * @loadBalance cy.loadBalance()
             */
            loadBalance(): void;
            /**
             * Custom command to intercept loading the group transactions
             * @loadTransactions cy.loadTransactions()
             */
            loadTransactions(): void;
            /**
             * Custom command to intercept creating a group transaction
             * @createTransaction cy.createTransaction()
             */
            createTransaction(): void;
            /**
             * Custom command to intercept loading users of a group to create a transaction
             * @loadUsers cy.loadUsers()
             */
            loadUsers(): void;
        }
    }
}

export {};
