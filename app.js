const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./schema/index');
const graphQLResolvers = require('./resolvers/index');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
        schema: graphQLSchema,
        rootValue: graphQLResolvers,
        graphiql: true
    })
);

// connect to database
mongoose.connect(`mongodb+srv://${
    process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
    }@cluster0-xds4h.mongodb.net/${
    process.env.MONGO_DB}?retryWrites=true&w=majority`, 
    { useUnifiedTopology: true,
      useNewUrlParser: true }
    ).then(() => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    });


