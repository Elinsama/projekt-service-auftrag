import express from 'express'
const app = express()
const port = 3000

app.get('/auftrag', (req, res) => {
  console.log("haaaaiiii");
  res.send("baaaiiiiii")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })