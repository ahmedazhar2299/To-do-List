const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const fileUtility = require(__dirname + "/fsUtility.js");
const app = express();
const port = 3000;
const filename = "Tasks.txt";
var Tasks = [];
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fileUtility
    .fetchJSON(filename)
    .then((data) => {
      res.render("Task", { toDoTasks: data });
    })
    .catch(() => {
      res.render("Task", { toDoTasks: [] });
    });
});

app.post("/", (req, res) => {
  const taskText = req.body.newTask;
  if (taskText.length != 0) {
    const task = {
      id: Date.now(),
      currentDate: date.generateDateTime(),
      completed: false,
      edit: false,
      text: taskText,
    };
    fileUtility.saveLists(filename, task);
    Tasks.push(task);
  }
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const ID = parseInt(req.body.hiddenID);
  fileUtility.fetchJSON(filename).then((result) => {
    fileUtility.deleteList(result, ID, filename).then((updatedList) => {
      updatedList.forEach((element) =>
        fileUtility.saveLists(filename, element)
      );
    });
  });

  res.redirect("/");
});

app.post("/complete", (req, res) => {
  const ID = parseInt(req.body.hiddenID);
  fileUtility.fetchJSON(filename).then((result) => {
    fileUtility.deleteList(result, -1, filename).then((updatedList) => {
      updatedList.forEach((element) =>{
        if (element.id == ID) {
              element.completed = true;
        
      }
      fileUtility.saveLists(filename, element)
    });
  })
})
res.redirect("/");
})


app.post("/edited",(req,res)=>{
  req.on("data", (data) => {
    const ID = JSON.parse(data).ID;
    const updatedText = JSON.parse(data).message;
    fileUtility.fetchJSON(filename).then((result) => {
      fileUtility.deleteList(result, -1, filename).then((updatedList) => {
        updatedList.forEach((element) => {
          if (element.id == ID) {
            if (updatedText !== "" && updatedText !== element.text){
                element.text = updatedText;
            }
          }
          fileUtility.saveLists(filename, element);
        });
      });
    });
  });
  res.redirect("/");
})


app.post("/edit", (req, res) => {
  const ID = parseInt(req.body.hiddenID);
  fileUtility.fetchJSON(filename).then((result) => {
    fileUtility.deleteList(result, "", filename).then((updatedList) => {
      updatedList.forEach((element) => {
        if (element.id == ID) {
          element.edit = element.edit === true ? false : true;
        }
        fileUtility.saveLists(filename, element);
      });
    });
  });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is listening on PORT ${port}`);
});
