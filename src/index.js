import express from "express"; //
import bodyParser from "body-parser";
import cors from "cors";
import data from "../data";

//============================================================================================================
//swagger UI related
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import expressSwaggerGenerator from "express-swagger-generator";

//not swaggerrelated
const app =express();
const {PORT= 3000} =process.env;

//to access swagger doc it is localhost:3000/api/v1/docs/
const host = `localhost:${PORT}`;
const basePath = "/"; // The forward slash is important!
// Options for the Swagger generator tool
const options = {
  // The root document object for the API specification
  // More info here: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema
  swaggerDefinition: {
    info: {
      title: "Health Insurance API",
      description: "This is Web service for patients, doctors and visits.",
      version: "1.0.0",
    },
    host: host,
    basePath: basePath,
    produces: ["application/json"],
    schemes: ["http", "https"],
  },
  basedir: __dirname, // Absolute path to the app
  files: ["./routes/**/*.js"], // Relative path to the API routes folder to find the documentation
};
// Initialize express-swagger-generator and inject it into the express app
expressSwaggerGenerator(app)(options);
//========================================================================================================



app.use(bodyParser.json()).use(cors());

app.get("/", (request, response) => response.send("Hello World UW")); // a simple hello world msg and listen

// fetch doctor data at api/v1/doctors
app.get("/api/v1/doctors", (req, res) => res.json(data.doctors));

// now divides the data into ids
app.get("/api/v1/doctors/:id", (req, res) => { 
    const id=parseInt(req.params.id);
    const doctor= data.doctors.find((doc)=>doc.id===id);

    if(!doctor) {
        return res.status(404).json({error: "Doctor not found"});
    }
    return res.json(doctor);
});

// fetch patient data at api/v1/patients and also dvide the data into id
app.get("/api/v1/patients", (req, res) => res.json(data.patients));
app.get("/api/v1/patients/:id", (req, res) => {
    const id=parseInt(req.params.id);
    const patient= data.patients.find((doc)=>doc.id===id);

    if(!patient) {
        return res.status(404).json({error: "Patient not found"});
    }
    return res.json(patient);
});

// filters to show case of doctorid=? & patientid =? visits,
// syntax on host is /visits?doctorid=num&patientid=num
app.get("/api/v1/visits", (req, res) => {
    const {doctorid, patientid}= req.query;
    let visits = data.visits;
    
    if (doctorid) {
        visits=visits.filter(
            (visit) => visit.doctorid=== parseInt(doctorid,10)
        );
    if (patientid){
        visits =visits.filter(
            (visit) => visit.patientid === parseInt(patientid, 10)
        );
    }
    }

    return res.json(visits);
});


app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => console.log(`Hello world, I am listening on port ${PORT}`));

