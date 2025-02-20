@api
Feature: API Tests for Contact List Application

  Scenario: User Authentication via API
    Given I have valid user credentials
    When I authenticate via the API
    Then I should receive a valid token

  @delete_contact
  Scenario: Create a Contact via API
    Given I authenticate via the API
    When I create a new contact via the API
    Then I should be able to retrieve the contact

  Scenario: Delete a Contact via API
    Given I authenticate via the API
    And I have a contact created via API
    When I delete the contact via the API
    Then The contact should no longer exist
