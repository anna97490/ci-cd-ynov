/* global cy */
/// <reference types="cypress" />
import '@testing-library/cypress'

describe('Page d’inscription', () => {
  it('charge la page d’inscription', () => {
    cy.visit('/')
    cy.contains("S'inscrire"); // Titre de ta page React
  })

  it('remplit le formulaire et envoie les données', () => {
    cy.visit('/')
    cy.get('input[name=nom]').type('Doe')
    cy.get('input[name=prenom]').type('Jane')
    cy.get('input[name=email]').type('jane.doe@test.com')
    cy.get('input[name=password]').type('Password123');
    cy.get('input[name=dateNaissance]').type('2000-01-01')
    cy.get('input[name=ville]').type('Paris')
    cy.get('input[name=codePostal]').type('75000')
    cy.get('button[type=submit]').click()
    cy.contains('Inscription réussie') // Message du toast
  })
})
