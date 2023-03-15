@wip
Feature: API Test


  Scenario: API test for status code 200
    When users sends a get request to "=http://api.localhost:4200"
    Then status code should be 200
    And content type should be "application/json;charset=UTF-8"