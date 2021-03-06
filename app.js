const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

app.use("/graphql",(req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth);

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


