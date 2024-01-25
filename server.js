const express = require('express')
const path = require('path')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'build')))

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
