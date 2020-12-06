const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = app => {
    app.set('port', '8081');

    app.use(bodyParser.json());
    app.use(cors({origin: '*'}))
}