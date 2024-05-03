let taskID = 0; //in case no local value exists in local storage (first time loading page)
const retrievedObject = JSON.parse(localStorage.getItem('taskIDLocal'));
taskID = retrievedObject
//alert(taskID) commented out. Uncomment for TaskID Debugging on Page Load.


//Take any previously existing Local Storage Items and Print them to the board. -IN PROGRESS. Add loop with iterations based on TaskID
const listEl = $('<li>');
const listDetail = localStorage.getItem('listDetailLocal')
listEl.addClass('list-group-item').text(listDetail);
listEl.appendTo(sortableLane1);
localStorage.setItem('taskIDLocal', taskID)
localStorage.setItem('listDetailLocal', listDetail)

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

//Code for Jquery Widgets/Form
const formEl = $('#skills-form');
const nameInputEl = $('#skill-name');
const dateInputEl = $('#datepicker');
const detailedDescriptionEl = $('#task-description');
const deleteBtnEl = $('delete');

// Todo: create a function to handle adding a new task
const createTaskCard = function (nameInputEl, dateInputEl, detailedDescriptionEl) {
  taskID++; // Todo: create a function to generate a unique task id
  const listEl = $('<li>');
  let toDoBoard = 1;
  const listDetail = nameInputEl.concat(' on ', dateInputEl, ' Details: ',detailedDescriptionEl, 'Task ID:', taskID);
  listEl.addClass('list-group-item').text(listDetail);
  listEl.appendTo(sortableLane1);
  localStorage.setItem('taskIDLocal', taskID)
  localStorage.setItem('listDetailLocal', listDetail)
};

const handleFormSubmit = function (event) {
  event.preventDefault();
  const nameInput = nameInputEl.val();
  const dateInput = dateInputEl.val();
  const detailedDescription = detailedDescriptionEl.val();
  
  if (!nameInput || !dateInput) {
    alert('You need to fill out the form!');
    return;
  }

  createTaskCard(nameInput, dateInput, detailedDescription, taskID);

  // resets form
  nameInputEl.val('');
  dateInputEl.val('');
  detailedDescriptionEl.val('');
  modal.style.display = "none";
};

formEl.on('submit', handleFormSubmit);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// Datepicker
$(function () {
  $('#datepicker').datepicker({
    changeMonth: true,
    changeYear: true,
  });
});

//Jquery, see Week 5 sortable example
//Todo: create a function to render the task list and make cards draggable. Update: use "connectWith"
$(function () { 
    $("#sortableLane1").sortable({ 
        connectWith: "#sortableLane3", 
        connectWith: "#sortableLane2",

    }); 
    $("#sortableLane2").sortable({ 
        connectWith: "#sortableLane1",
        connectWith: "#sortableLane3", 

    }); 
    $("#sortableLane3").sortable({ 
        connectWith: "#sortableLane1",
        connectWith: "#sortableLane2", 
    }); 
}); 

// Todo: create a function to handle deleting a task // Update: add IF statement to ensure it is being deleted over TRASH CAN. // Update: What else can be used aside from "out"?
$( "#sortableLane3" ).sortable({
    forcePlaceholderSize: true,
    tolerance: 'pointer',
    cursor: 'pointer',
    over: function () {
        deleteItem = false;
    },
    out: function () {
        deleteItem = true;
    },
    beforeStop: function (event, ui) {
        if(deleteItem === true) {
            ui.item.hide();
            if (confirm('Are you sure you want to delete this task from your board?')) {
                ui.item.remove();
            } else {
                ui.item.show();
            }
        }
    }
});

// Todo: create a function to create a task card
let modal = document.getElementById("modal");
let btn = document.getElementById("taskButton"); // Opens modal
let span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
  modal.style.display = "block"; // Target new task button to create modal
}
span.onclick = function() { 
  modal.style.display = "none"; // Close Modal function
}
