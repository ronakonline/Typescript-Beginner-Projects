const readline = require("readline");
const chalk = require("chalk");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const log = console.log;
const path = "./Todos.json";

type Todo = {
  task: string;
  completed: boolean;
  created_at: Date;
};

var TodoList: Array<Todo> = [];

const line_break: (num: number) => void = (numbers) => {
  for (var i = 0; i < numbers; i++) {
    log("\n");
  }
};

const menu = () => {
  log(
    chalk.yellow.bold(
      " 1. Add Task \n 2. Delete Task \n 3. List Completed Tasks \n 4. List Un-Completed Tasks \n 5. List All Tasks \n 6. Exit"
    )
  );
};

const ListTasks = (type: string | null = null) => {
  if (type == null) {
    console.clear();
    console.table(TodoList);
    line_break(1);
    log(chalk.cyan.bold(`Total Tasks : ${TodoList.length}`));
    line_break(1);
  } else if (type == "completed") {
    var uncompleted = TodoList.filter((el) => el.completed == true);
    console.table(uncompleted);
    line_break(1);
    log(chalk.cyan.bold(`Total Tasks : ${uncompleted.length}`));
    line_break(1);
  } else if (type == "un-completed") {
    var un_completed = TodoList.filter((el) => el.completed == false);
    console.table(un_completed);
    line_break(1);
    log(chalk.cyan.bold(`Total Tasks : ${un_completed.length}`));
    line_break(1);
  }
};

const handleInput = async (input: any) => {
  switch (input) {
    case "1":
      await addTask();
      console.clear();
      log(chalk.green.bold("Task Created!"));
      break;
    case "2":
      await deleteTask();
      console.clear();
      log(chalk.green.bold("Task Deleted!"));
      break;
    case "3":
      console.clear();
      await ListTasks("completed");
      break;
    case "4":
      console.clear();
      await ListTasks("un-completed");
      break;
    case "5":
      await ListTasks();
      break;
    case "6":
      process.exit(0);
    default:
      log(chalk.red.bold("Invalid Input!"));
  }
  return;
};

const addTask = async (): Promise<void> => {
  var todo: Todo;
  var task = await takeInput("Enter Task Details : ");
  var completed = await takeInput("Task Completed ? (true/false) : ");
  var created_at = new Date();

  if (completed == "true" || completed == "false") {
    completed = completed === "true";
  }

  while (typeof completed !== "boolean") {
    log(chalk.red.bold("Invalid Input!"));
    completed = await takeInput("Task Completed ? (true/false) : ");
    if (completed == "true" || completed == "false") {
      completed = completed === "true";
    }
  }

  todo = {
    task: task as string,
    completed: completed as boolean,
    created_at: created_at
  };

  TodoList.push(todo);
  saveFile();
};

const deleteTask = async (): Promise<void> => {
  var id = await takeInput('Enter Task id : ');
  TodoList = TodoList.filter((el,index) =>  index!= id);
  saveFile();
};

const saveFile = () => {
  fs.writeFile(path, JSON.stringify(TodoList), "utf8", (err: any) => {
    if (err) {
      log("Unable to save file !");
      process.exit(1);
    }
  });
  return;
};

const takeInput = (que: string) => {
  return new Promise((resolve, reject) => {
    rl.question(que, (answer: string) => {
      resolve(answer);
    });
  });
};

const ReadTodoFile = () => {
  if (fs.existsSync(path)) {
    fs.readFile(path, "utf8", (err: any, data: string) => {
      if (err) {
        log(chalk.red.bold("Unable to read file !"));
        process.exit(1);
      } else {
        TodoList = JSON.parse(data);
      }
    });
  } else {
    //create todo file
    fs.writeFile(path, JSON.stringify([]), "utf8", (err: any) => {
      if (err) {
        console.log("Unable to Create File !");
        process.exit(1);
      }
    });
  }
};

const main = async () => {
  console.clear();
  ReadTodoFile();
  log(chalk.red.bold(" 👋 Welcome to Todo App 📝"));
  line_break(1);
  menu();
  while (1) {
    var input = await takeInput("Enter your choice : ");
    await handleInput(input);
    menu();
  }
  rl.close();
};

main();
