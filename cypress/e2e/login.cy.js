/* global cy */
/// <reference types="cypress" />
import '@testing-library/cypress'

describe('Page de connexion', () => {
    it('charge la page de connexion', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('Se connecter');
    });

    it('remplit le formulaire et envoie les données', () => {
        cy.visit('http://localhost:3000/#/login');
        cy.get('input[name=email]').type('dd@admin.com');
        cy.get('input[name=password]').type('testtest1');
        cy.get('button[type=submit]').click();
    });

    it('affiche les erreurs pour des valeurs invalides', () => {
        cy.visit('http://localhost:3000/#/login');
        cy.get('input[name=email]').type('adresse-invalide');
        cy.get('input[name=password]').type('123');
        cy.get('button[type=submit]').click({ force: true });
        cy.contains("Adresse email invalide.");
        cy.contains("Mot de passe trop faible");
    });

    it('affiche les erreurs pour des valeurs invalides', () => {
        cy.visit('http://localhost:3000/#/login');
        cy.get('input[name=email]').type('email-invalide').blur();
        cy.get('input[name=password]').type('123').blur();
        cy.get('button[type=submit]').click({ force: true });
        cy.contains("Adresse email invalide.").should('be.visible');
        cy.contains("Mot de passe trop faible").should('be.visible');
    });
});
