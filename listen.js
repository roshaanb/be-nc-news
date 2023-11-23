const app = require("./app.js");
const port = 9090;

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Server is listening on http://localhost:${port} ...`);
});
