const express = require('express')
const app = express()
const ejs = require('ejs')
const cors = require('cors')
const multer = require("multer")

app.set('view engine', 'ejs')
app.use(cors())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'files/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  })

const upload = multer({ storage: storage })

app.listen(3030, () => {
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

app.post("/file-upload", upload.single('resume'), (req, res) => {
    console.log(req.file)
    console.log("Body : ",req.body)
    res.send("ok")
})