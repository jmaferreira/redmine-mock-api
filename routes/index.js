var express = require('express');
var router = express.Router();



router.get('/', async function (req, res, next) {
    res.send(
        ` 
        <html>
            <head>
                <title>redmine-mock-api</title>
            </head>
            <body>
                <h1>Available routes</h1>
                <ul>
                    <li>/api/v1/users?forceMail=email@address.domain</li>
                    <li>/api/v1/users/{id}?forceMail=email@address</li>
                    <li>/api/v1/issues?after={ISOdatetime}</li>
                </ul>
            </body>
        </html>

        `);

});


module.exports = router;
