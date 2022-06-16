const express = require("express")

const fs = require("fs")
const util = require("util")
const unlinkFile = util.promisify(fs.unlink)

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const port = process.env.PORT || 8080

const { uploadFile, getFileStream } = require("./s3")

const app = express()

// Enable CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.get('/images/:key', (req, res) => {
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
})

app.post("/images", upload.single("image") , async (req, res) => {
    const file = req.file
    const result = await uploadFile(file)
    await unlinkFile(file.path)
    res.send({imagePath: `/images/${result.Key}`})
})

app.listen(port, () => console.log("listening on port 8080"))