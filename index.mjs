import express from 'express'
import session from 'express-session';
import mustacheExpress from 'mustache-express';
import hbs from 'hbs';
import bodyParser from 'body-parser'
import { createAssignment, createUser, deleteAssignments, deleteUsers, finduser, getById, searching, searchUser, updateAssignment } from './database.mjs'
const app = express()
const port = 3000

function isAuthenticated(role) {
  return (req, res, next) => {
    const user = req.session.user
    const roles = Array.isArray(user.role) ? user.role : [user.role];
    if (user.password && roles.some((r) => role.includes(r))) {
      next()
    }
    else {
      res.redirect('/')
    }
  }
}

app.engine('mustache', mustacheExpress());

app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  cookie: { secure: false }, secret: "keyboard cat", resave: false,
  saveUninitialized: false
}))

app.use((req, res, next) => {
  if (!req.session.user) {
    req.session.user = {};
  }
  next();
})

app.post('/auftrag', isAuthenticated(["admin", "coworker"]), (req, res) => {
  if (req.body.id) {
    updateAssignment(req.body)
  }
  else {
    createAssignment(req.body);
  }
  res.render("back", { type: "assignment" })
})


app.post('/user', isAuthenticated(["admin", "manager"]), (req, res) => {
  createUser(req.body);
  res.render("back", { type: "user" })
})

app.post('/login', async (req, res) => {
  const user = await finduser(req.body);
  if (user) {
    req.session.regenerate(function (err) {
      if (err) next(err)
      req.session.user = user
      req.session.save(function (err) {
        if (err) return next(err)
        res.redirect('/static/main.html')
      })
    })
  }
  else res.render('error')
})

app.get('/print/:id', isAuthenticated(["admin", "coworker"]), async (req, res) => {
  const displayassignments = await getById(req.params.id)
  res.render("formular", displayassignments)
})

app.get('/edit/:id?', isAuthenticated(["admin", "manager"]), async (req, res) => {
  const edit = await getById(req.params.id)
  res.render("form", edit)
})

app.post('/delete', isAuthenticated(["admin", "manager"]), async (req, res) => {
  await deleteAssignments(Array.isArray(req.body.id) ? req.body.id : [req.body.id]);
  const auftrage = await searching(req.body);
  res.render("list", { auftrage, ...req.body });
})

app.post('/search', isAuthenticated(["admin", "manager", "coworker"]), async (req, res) => {
  const result = await searching(req.body);
  res.render("list", { auftrage: result, ...req.body })
})

app.get("/list", isAuthenticated(["admin", "manager", "coworker"]), async (req, res) => {
  res.render("list", { auftrage: await searching() })
})

app.post('/searchuser', isAuthenticated(["admin", "manager"]), async (req, res) => {
  const result = await searchUser(req.body);
  res.render("userlist", { users: result, ...req.body })
})

app.get("/listuser", isAuthenticated(["admin", "manager"]), async (req, res) => {
  res.render("userlist", { users: await searchUser() })
})

app.post('/deleteusers', isAuthenticated(["admin", "manager"]), async (req, res) => {
  await deleteUsers(Array.isArray(req.body.id) ? req.body.id : [req.body.id]);
  const users = await searchUser(req.body);
  res.render("userlist", { users, ...req.body });
})

app.get('/', (req, res) => {
  res.render("login")
})
app.use('/static', isAuthenticated(["coworker", "manager", "admin"]))
app.use('/static', express.static("."))
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})