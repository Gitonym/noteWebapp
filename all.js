const addButton = document.getElementById('add');
const noteTitle = document.getElementById('noteTitle');
const listNoteGrid = document.getElementById('listNoteGrid');
const noteTitleArrow = document.getElementById('noteTitleArrow');
const addPage = document.getElementById('addPage');
let listItems = document.getElementsByClassName('listItem');
const editButton = document.getElementById('edit');
const deleteButton = document.getElementById('delete');
const closeAddPageButton = document.getElementById('closeAddPage');
const saveButton = document.getElementById('save');
const newTitle = document.getElementById('newTitle');
const newContent = document.getElementById('newContent');
const list = document.getElementById('list');
const noteContent = document.getElementById('noteContent');
const editPage = document.getElementById('editPage');
const closeEditPageButton = document.getElementById('closeEditPage');
const saveEditButton = document.getElementById('saveEditButton');
const editedContent = document.getElementById('editedContent');
const editedTitle = document.getElementById('editedTitle');

let collapsed = false;

//---------------------EVENTLISTENERS-----------------------------------------------

//close edit page
closeEditPageButton.addEventListener('click', (e) => {
    editPage.style.transform = 'TranslateY(0)';
})

//collapse/expand list
noteTitle.addEventListener('click', collapseExpandList);

//saveButton Animations
saveButton.addEventListener('click', playClickAnimation);

//addPageCloseButton ANimations
closeAddPageButton.addEventListener('click', playClickAnimation);

//toolAnimations
addButton.addEventListener('click', playClickAnimation);
editButton.addEventListener('click', playClickAnimation);
deleteButton.addEventListener('click', playClickAnimation);

//discard new note
closeAddPageButton.addEventListener('click', closeAddPage);
//create new note
addButton.addEventListener('click', openNewAddPage);

//------------------------FUNCTIONS-------------------------------------------------

function openNewAddPage() {
    addPage.style.transform = 'translateY(100%)';
    newTitle.value = '';
    newContent.value = '';
}

function closeAddPage() {
    addPage.style.transform = 'translateY(0)';
}

//hover aniation
function playHoverAnimation() {
    this.style.animation = 'none';
    this.offsetHeight;
    this.style.animation = 'wobble 0.8s ease-in-out';
}

//click animation
function playClickAnimation() {
    this.style.animation = 'none';
    this.offsetHeight;
    this.style.animation = 'squish 0.8s ease-in-out';
}



function collapseExpandList() {
    if (collapsed) {
        listNoteGrid.style.gridTemplateColumns = 'max(min(25%, 20rem), 15rem) auto';
        noteTitleArrow.innerHTML = '&#8612;';
    } else {
        listNoteGrid.style.gridTemplateColumns = '0 100%';
        noteTitleArrow.innerHTML = '&#8614;';
    }
    collapsed = !collapsed;
}