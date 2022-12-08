const express = require('express')
const app = express()
const ejs = require('ejs')

app.set('view engine', 'ejs')

app.listen(3000, () => {
    console.log(`listening on port : http://localhost:3000`)
})

app.get('/', (req, res) => {
    res.send("Hello Express server..")
})

app.get('/template-engine', (req, res) => {
    let others = {
        company: "aspire",
        location: "chennai"
    }
    res.render('demo',{
        name: "edwin",
        age: 22,
        data: others
    })
})