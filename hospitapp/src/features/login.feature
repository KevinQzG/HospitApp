Feature: Login to HospitApp platform
  As a patient, I must have the ability to register and log in to an account to access all the required login features of HospitApp.

  Background:
    Given the user has an account on the HospitApp platform

  Scenario: Successful login with valid credentials
    Given the user is on the HospitApp home page
    When the user clicks the "Iniciar Sesión" button
    And the user enters valid credentials "test@example.com" and "password1234"
    And the user submits the login form
    Then the user should be redirected to the home page
    And the "Iniciar Sesión" button should be replaced by "Cerrar Sesión"
    And a user session should be created

  Scenario: Failed login with invalid credentials
    Given the user is on the HospitApp home page
    When the user clicks the "Iniciar Sesión" button
    And the user enters invalid credentials "wrong@example.com" and "wrongpass"
    And the user submits the login form
    Then the user should see an error message "Credenciales incorrectas"