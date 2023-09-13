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
        }
    }
}

export {};
