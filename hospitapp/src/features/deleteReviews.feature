Feature: Delete Reviews by Admin
  As an Administrator, I must be able to view and delete reviews created by patients to control reported and inappropriate reviews.

  Background:
    Given the user is on the HospitApp home page
    When the user clicks the "Iniciar Sesión" button
    And the user enters valid credentials "admin.test@example.com" and "password1234"
    And the user submits the login form
    Then the user should be redirected to the home page
    And a user session should be created
    And the "Iniciar Sesión" button should be replaced by "Cerrar Sesión"
    And the user should be redirected to the home page
    When the user clicks the "Buscar" button
    And the user should select the first ips in the list
    And the user clicks the add review button
    And the user fills in the review form with "Test from Functional Testing" and a rating of 5 and submits the form
    Then the user should see a success message "¡Reseña publicada correctamente!"

  Scenario: Successful deletion of a review
    Given the admin is on the HospitApp admin page
    When the admin clicks the "Editar Reviews" button
    And the admin clicks on the trash icon of the first review
    And the admin confirms the deletion
    Then the admin should see the updated list of reviews
