import express from 'express'
import session from 'express-session';
import mustacheExpress from 'mustache-express';
import hbs from 'hbs';
import bodyParser from 'body-parser'
import { createAssignment, createUser, deleteAssignments, finduser, searching } from './database.mjs'
const app = express()
const port = 3000

function isAuthenticated (req, res, next) {
  if (req.session.user && req.session.user.password) next()
  else res.redirect('/')
}

app.engine('mustache', mustacheExpress());

app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  cookie: {secure: false}, secret: "keyboard cat", resave: false,
  saveUninitialized: false
}))

app.use((req, res, next) => {
  if (!req.session.user) {
    req.session.user = {};
  }

  next();
})

app.post('/auftrag',isAuthenticated, (req, res) => {
  createAssignment(req.body);
  res.render("back")
})

app.post('/user',isAuthenticated, (req, res) => {
  createUser(req.body);
  res.render("back")
})

app.post('/login', async (req, res) => {
  const user = await finduser(req.body);
  if (user) {
    req.session.regenerate(function (err) {
      if (err) next(err)
      req.session.user = user
      req.session.save(function (err) {
        if (err) return next(err)
        res.redirect('/main.html')
      })
    })
  }
  else res.render('error')
})

app.post('/delete', isAuthenticated,async(req, res) => {
  await deleteAssignments(req.body.id);
  const auftrage = await searching(req.body);
  res.render("list", { auftrage, ...req.body });
})

app.post('/search',isAuthenticated, async (req, res) => {
  const result = await searching(req.body);
  console.log(req.body, result);
  res.render("list", { auftrage: result, ...req.body })
})

app.get("/list",isAuthenticated, async (req, res) => {
  res.render("list", { auftrage: await searching() })
})

app.use(express.static("."))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})