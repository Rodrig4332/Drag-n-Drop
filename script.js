const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item List
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogListEl = document.getElementById('backlog-list');
const progressListEl = document.getElementById('progress-list');
const completeListEl = document.getElementById('complete-list');
const onHoldListEl = document.getElementById('on-hold-list');

// items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionanlity
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if avaailable, set default values if not
function getSavedColumns() {
    if (localStorage.getItem('backlogItems')) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        onHoldListArray = JSON.parse(localStorage.onHoldItems);
    } else {
        backlogListArray = ['Release the course', 'Sit back and relax'];
        progressListArray = ['Work on projects', 'Listen to music'];
        completeListArray = ['Being cool', 'Getting stuff done'];
        onHoldListArray = ['Being uncool'];
    }
}

// Set locaStorage Arrays
function updateSavedColumns() {
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
    const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
    arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    });
}

// Filter Array to remove empty values
function filterArray(array) {
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
    // List Item
    const listEl = document.createElement('li');
    listEl.textContent = item;
    listEl.id = index;
    listEl.classList.add('drag-item');
    listEl.draggable = true;
    listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
    listEl.setAttribute('ondragstart', 'drag(event)');
    listEl.contentEditable = true;
    // Append
    columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStaorage
function updateDOM() {
// Check localStorage once 
  if (!updatedOnLoad) { 
    getSavedColumns();
}

  // Backlog Column
  backlogListEl.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogListEl, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressListEl.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressListEl, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeListEl.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeListEl, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldListEl.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldListEl, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumn = listColumns[column].children;
    if (!dragging) {
      if (!selectedColumn[id].textContent) {
        delete selectedArray[id];
      } else {
        selectedArray[id] = selectedColumn[id].textContent;
      }
      updateDOM();
    }
  }

// Add to column List, Reset textbox
function addToColumn(column) {
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(itemText);
    updateDOM(column);
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allow arrays to reflect Drag and Drop items
function rebuildArrays() {
  backlogListArray = Array.from(backlogListEl.children).map(i => i.textContent);
  progressListArray = Array.from(progressListEl.children).map(i => i.textContent);
  completeListArray = Array.from(completeListEl.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldListEl.children).map(i => i.textContent);
  updateDOM();
}

// When the Item enters Column Area
function dragEnter(column) {
    listColumns[column].classList.add('over');
    currentColumn = column;
   }

// When Item starts dragging
function drag(e) {
 draggedItem = e.target;
 dragging = true;
}


// Column allows for the item to drop
function allowDrop(e) {
 e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
    e.preventDefault();
    const parent = listColumns[currentColumn];
    // Remove  Background color/padding
    listColumns.forEach((column) => {
     column.classList.remove('over');   
    });
    // Add item to column
    parent.appendChild(draggedItem);
    // Dragging complete
    dragging = false;
    rebuildArrays();
}

// On Load
updateDOM();
