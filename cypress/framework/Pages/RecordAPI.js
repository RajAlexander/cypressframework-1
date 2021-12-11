import { Given } from "cypress-cucumber-preprocessor/steps";
import core from "../Utils/CoreFunctions";

const POST = Cypress.env("postMethod");
const GET = Cypress.env("getMethod");
const DELETE = Cypress.env("deleteMethod");
const SUCCESS_STATUS = Cypress.env("SUCCESS_STATUS");
const NO_CONTENT_STATUS = Cypress.env("NO_CONTENT_STATUS");
const BEARER = Cypress.env("bearerAuthentication");
const applicationId = Cypress.env("applicationId");
const createRecordURL = Cypress.env("apiserver") + Cypress.env("createRecordURI");
const pathToLoginApiResponseFolder = Cypress.env("pathToLoginApiResponseFolder");
const pathToCreateRecordApiResponseFolder = Cypress.env("pathToCreateRecordApiResponseFolder");
const pathToGetRecordApiResponseFolder = Cypress.env("pathToGetRecordApiResponseFolder");
const createRecordApiRequestBody = {
  applicationId: applicationId,
  values: {
    adwok: "Hyderabad",
    alzxa: "nareshraj423@yahoo.com",
    aif8s: "",
    a75lt: "Naresh",
    a8rki: "G",
    avf8l: "",
    au0sv:
      "Flat No. 403, 4th Floor, SV Emerald Apartment.\nInnova Hospital Lane",
    abjcf: "",
    ah1nd: "",
    abavp: 500017,
  },
};

/* Swagger API: https://qa-practical.qa.swimlane.io/docs */
class RecordAPI {
  /* Singleton Pattern for single instance creation. */
  constructor() {
    if (RecordAPI._instance) return RecordAPI._instance;
    RecordAPI._instance = this;
  }

  /* Create Record API implementation */
  createRecordRequest = (response) => {
    let userLoginResponse = response;
    core.writeFile(pathToLoginApiResponseFolder, JSON.stringify(userLoginResponse));
    /* POST Request PayLoad */
    const options = {
      method: POST,
      url: createRecordURL,
      headers: { Authorization: BEARER + userLoginResponse.body.token },
      body: createRecordApiRequestBody,
      failOnStatusCode: false,
    };

    /* POST Request call */
    core.request(options).then((createRecordApiResponse) => {
      if (createRecordApiResponse.status == SUCCESS_STATUS) core.log("Record created successfully.");
      else core.log("Bad Request");
      core.writeFile(pathToCreateRecordApiResponseFolder, JSON.stringify(createRecordApiResponse));
    });
  };

  /* Get Record API implementation */
  getRecordRequest = (response) => {
    let userLoginResponse = response;
    core.readFile(pathToCreateRecordApiResponseFolder).then((createRecordApiResponse) => {
      /* GET Request PayLoad */
      const options = {
        method: GET,
        url: createRecordURL + "/" + createRecordApiResponse.body.id,
        headers: { Authorization: BEARER + userLoginResponse.body.token },
        failOnStatusCode: false,
      };

      /* GET Request Call */
      core.request(options).then((getRecordResponse) => {
        if (getRecordResponse.status == SUCCESS_STATUS) core.log("Record fetched successfully.");
        else core.log("Bad Request");
        core.writeFile(pathToCreateRecordApiResponseFolder, JSON.stringify(getRecordResponse));
      });
    });
  };

  /* Delete Record API implementation */
  deleteRecordRequest = (response) => {
    let userLoginResponse = response;
    /* Read existing created record. */
    core.readFile(pathToCreateRecordApiResponseFolder).then((createRecordApiResponse) => {
      /* DELETE Request PayLoad */
      const options = {
        method: DELETE,
        url: createRecordURL + "/" + createRecordApiResponse.body.id,
        headers: { Authorization: BEARER + userLoginResponse.body.token },
        failOnStatusCode: false,
      };

      /* DELETE Request Call */
      core.request(options).then((deleteRecordApiResponse) => {
        if (deleteRecordApiResponse.status == NO_CONTENT_STATUS) core.log("Record deleted successfully.");
        else core.log("Bad Request");
        expect(deleteRecordApiResponse.status).is.equal(NO_CONTENT_STATUS);
      });
    });
  };
}

/* Create an instance and export. */
const recordAPI = new RecordAPI();
export default recordAPI;
