var express = require('express');
var app = express();

app.use(express.static("study-dash-angular/browser"));
app.get("/", function(req, res) {
  res.redirect('/');
});

app.listen(4200);
