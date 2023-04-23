@wip
Feature: API Test


  Scenario: API test for status code 200
    Given user is connected to the server
    When authorized users send a get request to "=http://api.localhost:4200"
    Then status code should be 200

  Scenario: API test for status code 401
    Given user is connected to the server
    When unauthorized users send a get request to "=http://api.localhost:4200"
    Then status code should be 401

  Scenario: API test for status code 503
    Given user is connected to the server
    When authorized users send an unavailable request to "=http://api.localhost:4200"
    Then status code should be 503
