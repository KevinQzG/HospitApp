Feature: CRUD Reviews
  As a patient, I must have the ability to create, edit, and remove a review to express my opinion of an IPS based on my experience. Additionally, I want to be able to select and display all the information of an IPS's review.

  Background:
    Given the user is on the HospitApp home page
    When the user clicks the "Iniciar Sesión" button
    And the user enters valid credentials "test@example.com" and "password1234"
    And the user submits the login form
    Then the user should be redirected to the home page
    And a user session should be created
    And the "Iniciar Sesión" button should be replaced by "Cerrar Sesión"
    And the user should be redirected to the home page

  Scenario: The user CRUDs a review
    Given the user is on the HospitApp home page
    When the user clicks the "Buscar" button
    And the user selects the "ANESTESIA" specialism
    And the user selects the "COOSALUD EPS" EPS
    And the user submits the "Buscar" button
    Then the user should be redirected to the IPS list page with "ANESTESIA" specialism and "COOSALUD EPS" EPS selected
    And the user should see the "CLINICA LAS AMERICAS" IPS first in the List
    When the user clicks the "Agregar Filtro" button
    And the user selects the "Distancia" filter in DESCENDING order
    Then the user should see the "E.S.E HOSPITAL SAN VICENTE DE PAUL DE CALDAS" IPS first in the List
    When the user clicks the "E.S.E HOSPITAL SAN VICENTE DE PAUL DE CALDAS" IPS
    Then the user should be redirected to the IPS detail page
    When the user clicks the add review button
    And the user fills in the review form with "Test from Functional Testing" and a rating of 5 and submits the form
    Then the user should see a success message "¡Reseña publicada correctamente!"
    When the user clicks the edit review button
    And changes the review text to "Test from Functional Testing - Edited" and submits the form
    Then the user should see a success message "¡Reseña actualizada correctamente!"
    When the user clicks the delete review button
    Then the user should see a success message "¡Reseña eliminada correctamente!"