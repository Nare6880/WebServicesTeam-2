package apiTests.step_definitions;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.restassured.response.Response;


import static io.restassured.RestAssured.given;


public class Hooks {

    @Before
    public void setUp(){
        Response response = given().get("local_api_url");
    }

    @After
    public void tearDown(Scenario scenario){


    }


}