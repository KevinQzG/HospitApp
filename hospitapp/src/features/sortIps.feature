Feature: Sort IPSs Search
  As a patient, I want to sort IPSs by closeness, rating, and priority so that I can find an IPS that best meets my needs.

  Scenario: The user sorts IPSs without location
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