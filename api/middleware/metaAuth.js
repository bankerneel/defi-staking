const metaAuth = require('meta-auth')();

app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
  // Request a challenge from the server
  res.send(req.metaAuth.challenge);
});

app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {
  if (req.metaAuth.recovered) {
    // Signature matches the cached address/challenge
    // Authentication is valid, assign JWT, etc.
    res.send(req.metaAuth.recovered);
  } else {
    // Sig did not match, invalid authentication
    res.status(400).send();
  }
});
