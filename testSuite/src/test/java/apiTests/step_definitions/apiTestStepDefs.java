package apiTests.step_definitions;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import org.junit.Assert;

import static io.restassured.RestAssured.when;

public class apiTestStepDefs {

    Response response;

    @When("users sends a get request to {string}")
    public void users_sends_a_get_request_to(String urlExtension) {

    }

    @Then("status code should be {int}")
    public void status_code_should_be(int statusCode) {
        Assert.assertEquals(statusCode,response.statusCode());
    }

    @Then("content type should be {string}")
    public void content_type_should_be(String contentType) {
        Assert.assertEquals(contentType,response.contentType());
    }

}
