import express from 'express'
import mustacheExpress from 'mustache-express';
import hbs from 'hbs';
import bodyParser from 'body-parser'
import { createAssignment, searching } from './database.mjs'
const app = express()
const port = 3000

app.engine('mustache', mustacheExpress());

app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/auftrag', (req, res) => {
  console.log(req.body);
  createAssignment(req.body); 
  res.send("sicher gespechert")
})

app.post('/search', async (req, res) => {
  const result = await searching(req.body); 
  console.log(req.body, result);
  res.render("list", {auftrage: result, ...req.body})
})

app.get("/list", async (req, res) => res.render("list", {auftrage: await searching()}))

app.use(express.static("."))
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })