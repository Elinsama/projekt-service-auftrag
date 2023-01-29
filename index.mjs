import express from 'express'
import bodyParser from 'body-parser'
import { createAssignment } from './database.mjs'
const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/auftrag', (req, res) => {
  console.log(req.body);
  createAssignment(req.body); 
  res.send("sicher gespechert")
})
app.use(express.static("."))
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })