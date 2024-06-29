import express from 'express';
import cors from 'cors';
import conditions from './src/handlers/conditions';
import symptoms from './src/handlers/symptoms';
import mediator from './src/handlers/mediators';

// Express app setup
const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: `${process.env.CLIENT_URL}`,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.send(`
    <center>
        <h1>Pocket-Doctor API</h1>
    </center>

    <p>Use the following routes to access the API:</p>

    <ul>
        <li><a href="/conditions">/conditions</a> - Get a list of medical conditions</li>
        <ul>
            <li><a href="/conditions/1">/conditions/:id</a> - [GET] - Get a specific medical condition</li>
            <li><a href="/conditions/add">/conditions/add</a> - [POST] - Add a new medical condition to the database</li>
            <li><a href="/conditions/1/delete">/conditions/:id/delete</a> - [DELETE] - Delete a medical condition from the database</li>
        </ul>
        <br>
        <hr>
        <br>
        <li><a href="/symptoms">/symptoms</a> - Get a list of symptoms</li>
        <ul>
            <li><a href="/symptoms/1">/symptoms/:id</a> - [GET] - Get a specific symptom</li>
            <li><a href="/symptoms/add">/symptoms/add</a> - [POST] - Add a new symptom to the database</li>
            <li><a href="/symptoms/1/delete">/symptoms/:id/delete</a> - [DELETE] - Delete a symptom from the database</li>
        </ul>
        <br>
        <hr>
        <br>
        <li><a href="/mediators">/mediators</a> - [GET] - Get a list of mediators</li>
        <ul>
            <li><a href="/mediators/1">/mediators/:id</a> - [GET] - Get a specific mediator</li>
            <li><a href="/mediators/add">/mediators/add</a> - [POST] - Add a new mediator to the database</li>
            <li><a href="/mediators/1/delete">/mediators/:id/delete</a> - [DELETE] - Delete a mediator from the database</li>

        </ul>
    </ul>
    `);
});

conditions(app);
symptoms(app);
mediator(app);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
