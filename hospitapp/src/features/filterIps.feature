Feature: Filter IPSs
  As a patient, I want to filter IPSs by specialism, EPS and location range so that I can find an IPS that meets my needs.

  Scenario: The user filters IPSs without location
    Given the user is on the HospitApp home page
    When the user clicks the "Buscar" button
    And the user select the "TRANSPORTE ASISTENCIAL MEDICALIZADO" specialism
    And the user submits the "Buscar" button
    Then the user should be redirected to the IPS list page
    And the user should see the "UNITED EMS COLOMBIA S.A.S." IPS first in the List