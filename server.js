const express = require('express');
const path = require('path');

module.exports = {
    app: function() {
        const app = express()

        // app.use(morgan('dev'))
            // app.use(bodyParser.json())
            // app.use(bodyParser.urlencoded({ extended: false }))

        // const indexPath = path.join(__dirname, 'index.html')
        const publicPath = express.static(path.join(__dirname, 'dist'))

        app.use('/dist', publicPath)
        //     // app.use('/', require(./routes/index))
        // app.get('/', function(_, res) { res.sendFile(indexPath) })

        return app
    }
}