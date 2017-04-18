const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/assets'));

//views configuration
app.engine('.html', exphbs({extname: '.html'}));
app.set('views', __dirname + '/views');
app.set('view engine', '.html');

//routing configuration
require('./router')(app);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
