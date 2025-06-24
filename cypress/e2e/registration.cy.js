/* global cy */
/// <reference types="cypress" />
import '@testing-library/cypress'

describe('Page d’inscription', () => {
  it('charge la page d’inscription', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("S'inscrire"); // Titre de ta page React
  })

  it('remplit le formulaire et envoie les données', () => {
    cy.visit('http://localhost:3000/') // Assurez-vous que l'URL correspond à votre application
    cy.get('input[name=nom]').type('Doe')
    cy.get('input[name=prenom]').type('Jane')
    cy.get('input[name=email]').type('jaane.do@test.com')
    cy.get('input[name=password]').type('Password123');
    cy.get('input[name=dateNaissance]').type('2000-01-01')
    cy.get('input[name=ville]').type('Paris')
    cy.get('input[name=codePostal]').type('75000')
    cy.get('button[type=submit]').click()
    cy.contains('Inscription réussie') 
  })

  it('affiche les erreurs pour des valeurs invalides', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[name=email]').type('email-invalide'); 
    cy.get('input[name=password]').type('123'); 
    cy.get('input[name=codePostal]').type('abc'); 
    cy.get('input[name=nom]').type(' ').clear().blur();       
    cy.get('input[name=prenom]').type(' ').clear().blur();   
    cy.get('input[name=dateNaissance]').focus().blur();      
    cy.get('input[name=ville]').type(' ').clear().blur();    
    cy.get('button[type=submit]').click({ force: true });
    cy.contains("Le nom est requis.");
    cy.contains("Le prénom est requis.");
    cy.contains("L'adresse email n'est pas valide.");
    cy.contains("Mot de passe trop faible");
    cy.contains("La date de naissance est requise.");
    cy.contains("La ville est requise.");
    cy.contains("Le code postal doit comporter 5 chiffres.");
  });
})
