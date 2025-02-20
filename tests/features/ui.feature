@ui
Feature: UI Tests for Contact List Application

  Scenario: User Registration and Login
    Given I navigate to the registration page
    When I register a user with valid credentials
    Then I should see the contact list page
    When I log in with the same credentials
    Then I should see the contact list page

  Scenario: Create a New Contact
    Given I am logged in
    When I create a new contact with valid data
    Then I should see the contact in the list

  Scenario: Edit an Existing Contact
    Given I am logged in with an existing contact
    When I edit the contact's email
    Then I should see the updated contact in the list
