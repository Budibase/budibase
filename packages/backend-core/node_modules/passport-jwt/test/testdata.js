module.exports = {
    // Note, this JWT will expire sometime in 2286. If unit tests are failing around this time try
    // generating a new, valid token :)
    valid_jwt : {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImlzcyI6ImV4YW1wbGVzb2Z0LmNvbSIsImV4cCI6Ijk5OTk5OTk5OTkifQ.CbpI0TNI-FYXe6p3PgM__jwlz6aCT1qpUBsTVCfWuBM",
        payload : {
            "sub": "1234567890",
            "name": "John Doe",
            "iss": "examplesoft.com",
            "exp": "9999999999"
        },
        secret: 'secret'
    }
};
