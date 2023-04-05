package apiTests.step_definitions;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.restassured.RestAssured;



public class Hooks {

    @Before
    public void setUp(){
        RestAssured.baseURI = "http://api.localhost:4200";
    }

    @After
    public void tearDown(Scenario scenario){
        RestAssured.reset();

    }


}
