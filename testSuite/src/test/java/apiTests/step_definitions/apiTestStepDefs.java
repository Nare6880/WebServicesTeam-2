package apiTests.step_definitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import org.junit.Assert;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.when;

public class apiTestStepDefs {

    Response response;

    @Given("user is connected to the server")
    public void user_is_connected_to_the_server() {

    }

    @When("authorized users send a get request to {string}")
    public void authorized_users_send_a_get_request_to(String urlExtension) {
        Response response = given().auth().none().get("local_api_url");
    }

    @Then("status code should be {int}")
    public void status_code_should_be(int statusCode) {
        Assert.assertEquals(statusCode,response.statusCode());
    }

    @Then("content type should be {string}")
    public void content_type_should_be(String contentType) {
        Assert.assertEquals(contentType,response.contentType());
    }

    @When("unauthorized users send a get request to {string}")
    public void unauthorized_users_send_a_get_request_to(String string) {
        Response response = given().get("local_api_url");
    }
    
        @When("authorized users send an unavailable request to {string}")
    public void authorized_users_send_an_unavailable_request_to(String unavailable) {
        Response response = given().get("local_api_url");
    }
}
