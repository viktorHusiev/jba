const express = require("express")

const app = express()

app.use(
  require("body-parser").raw({
    type: "application/json",
  })
);

app.use(express.static("public"))

app.post("/execute", (req, res) => {
  // console.log("execute body ===========> ", req.body);
  const requestBody = JSON.parse(req.body.toString());
  const name = requestBody.inArguments[0].Name;
  console.log("execute arg.inArguments[0].Name ===========> ", name);

  if (name.startsWith("Y")) {
    console.log("firstBranchKey");
    return res.status(200).json({ branchResult: 'firstBranchKey' });
  }
  else {
    console.log("secondBranchKey");
    return res.status(200).json({ branchResult: 'secondBranchKey' });
  }
})

app.post("/save", (req, res) => {
  console.log("save body ===========> ", req.body)
  res.send({ status: 200 })
})

app.post("/publish", (req, res) => {
  console.log("publish body ===========> ", req.body)
  res.send({ status: 200 })
})

app.post("/validate", (req, res) => {
  console.log("validate body ===========> ", req.body)
  res.send({ status: 200 })
})

app.post("/stop", (req, res) => {
  console.log("stop body ===========> ", req.body)
  res.send({ status: 200 })
})

app.listen(process.env.PORT || 3000, () => {
  console.log("listening...")
})
