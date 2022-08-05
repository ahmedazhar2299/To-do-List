const e = require("express");
const fs = require("fs");

exports.saveLists = (filename, Task) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(filename, JSON.stringify(Task) + "\n", (err) => {
      if (err) reject(err);
      else resolve(JSON.stringify(Task));
    });
  });
};

exports.fetchJSON = async (filename) => {
    const data = await readLists(filename);
    const TaskList = await getJsonObjects(data);
    return new Promise((resolve, reject) => {
      if (TaskList.length !== 0) resolve(TaskList);
      else reject([]);
    });
  };

const getJsonObjects = async (data) => {
  return new Promise((resolve, reject) => {
    let buffer = "";
    let Task = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== "}") buffer += data[i];
      else {
        buffer += data[i];
        Task.push(JSON.parse(buffer));
        buffer = "";
      }
    }
    if (Task.length === 0) reject([]);
    else resolve(Task);
  });
};

exports.deleteList =  async(TasksList,ID,filename)=>{
    TasksList = TasksList.filter((element) => element.id != ID);
    return new Promise((resolve,reject)=>{
        fs.truncate(__dirname+'/'+filename,0,function (err) {
            if (err) reject(err)
            else{
            resolve(TasksList)
            }
        })
    })
   }





const readLists = async (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) reject(err);
      else {
        resolve(data);
      }
    });
  });
};
