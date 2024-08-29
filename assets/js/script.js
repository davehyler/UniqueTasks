// Retrieve tasks and nextID from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextID = JSON.parse(localStorage.getItem("nextID"));

// Todo: create a function to generate a unique task id
function generatetaskID() {
    let taskID = `id_${Math.random()}`;
    if (nextID == null) {
        nextID = [];
    }

    for (i = 0; i < nextID.length; i++) {
        if (taskID == nextID[i]) {
            taskID = generatetaskID();
        }
    }
    
    nextID.push(taskID);
    localStorage.setItem("nextID", JSON.stringify(nextID));

    return taskID;
}

// Todo: create a function to create a task card (update: moved to bottom, make sure to "append in order")
function createTaskCard(task) {
    //Card
    const taskCard = $('<div>');
    taskCard.addClass('card', 'task-card', 'my-3');
    //Card Header
    const taskHeader = $('<h4>');
    taskHeader.addClass('card-header');
    taskHeader.text(task.title);
    taskCard.append(taskHeader);
    //Card Body
    const taskBody = $('<div>');
    taskBody.addClass('card-body');
    taskCard.append(taskBody);
    //Card Due Date
    const taskDate = $('<p>');
    taskDate.text(task.dueDate);
    taskBody.append(taskDate);
    //Card Description
    const taskDescription = $('<p>');
    taskDescription.text(task.description);
    taskBody.append(taskDescription);
    //Delete Button
    const deleteBtn = $('<button>');
    deleteBtn.addClass('deleteBtn btn-danger text-white btn');
    deleteBtn.text('Delete');
    taskBody.append(deleteBtn);
  
    // if statement to check the current date (using dateJS) against due date for colorization
    const today = dayjs();
    const taskDue = dayjs(task.dueDate, 'MM/DD/YYYY');  
    if (task.dueDate && task.status !== 'done') 
    {
        if (today.isSame(taskDue, 'day')) 
        {
          taskCard.addClass('bg-warning text-white');
        } 
        else if (today.isAfter(taskDue)) 
        {
          taskCard.addClass('bg-danger text-white');
        }
    }
    return taskCard;
  }
  
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasksToDo = $('#todo-cards');
    const tasksCurrent = $('#in-progress-cards');
    const tasksComplete = $('#done-cards');

    if (taskList == null) 
    {
        taskList = [];
    }
    for (i = 0; i < taskList.length; i++) 
    {   
        if (taskList[i].status == 'done') 
        {
            const newCard = createTaskCard(taskList[i]);
            newCard.attr('id', taskList[i].taskID);
            newCard.addClass('draggable');
            tasksComplete.append(newCard);
        } 
        else if (taskList[i].status == 'in-progress') 
        {
            const newCard = createTaskCard(taskList[i]);
            newCard.attr('id', taskList[i].taskID);
            newCard.addClass('draggable');         
            tasksCurrent.append(newCard);
        } 
        else 
        {
            const newCard = createTaskCard(taskList[i]);
            newCard.attr('id', taskList[i].taskID);
            newCard.addClass('draggable');
            tasksToDo.append(newCard);
        }
    }


    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    const titleInput = $('#title');
    const descriptionInput = $('#description');
    const dueDateInput = $('#dueDate');

        const newCard = {
            title: titleInput[0].value.trim(),
            description: descriptionInput[0].value.trim(),
            dueDate: dueDateInput[0].value.trim(),
            status: 'to-do',
            taskID: generatetaskID()
        }

        if (taskList == null) {
            taskList = [];
        }

        taskList.push(newCard);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        
        document.location.reload();
    } 

// Todo: create a function to handle deleting a task
function handleDeleteTask(event)
{
  const deletedCard = event.target.parentNode.parentNode;
    for (i = 0; i < taskList.length; i++) 
    {
        if (taskList[i].taskID == deletedCard.id) 
        {
            taskList.splice([i], 1);
        }
    }
    for (i = 0; i < nextID.length; i++) 
    {
        if (nextID[i] == deletedCard.id) 
        {
            nextID.splice([i], 1);
        }
    }
    deletedCard.remove();  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextID", JSON.stringify(nextID));
    document.location.reload();
    return taskList;
}

function handleDrop(event, ui) {

    const taskCardID = ui.draggable[0].id;
    const draggableTask = ui.draggable[0];
    const taskLane = event.target.id;

    for (i = 0; i < taskList.length; i++) {
        if (taskList[i].taskID == taskCardID) {
            taskList[i].status = taskLane;
        }
    }

    event.target.append(draggableTask);  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    document.location.reload();

    return taskList;
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () 
{
    renderTaskList();
    $('#add-task').on('click', function () 
      {
          handleAddTask();
      });
    $('.deleteBtn').on('click', function (event) 
      {
          handleDeleteTask(event);
      });
    $(".droppable").droppable(
      {
        accept: '.draggable',
        drop: handleDrop,
      });
    $('#dueDate').datepicker();
    {
    }
});
