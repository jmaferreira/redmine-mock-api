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
                <h1>Redmine Mock API</h1>
                <h2>Available routes</h2>
                <code>
                    <ul>
                        <li><a href="/api/v1/users?forceMail=email@address.domain">/api/v1/users?forceMail=email@address.domain</a></li>
                        <li><a href="/api/v1/users/11?forceMail=email@address">/api/v1/users/{id}?forceMail=email@address</a></li>
                        <li><a href="/api/v1/issues?after=2019-04-13T12:00">/api/v1/issues?after={ISOdatetime}</a></li>
                    </ul>
                </code>
            </body>
        </html>

        `);

});


module.exports = router;
