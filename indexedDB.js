const IDB = (function init(){
    let db = null;
    let objectStore = null;
    let DBOpenReq = indexedDB.open('NotesDB', 1);

    DBOpenReq.addEventListener('error', (err) => {
        console.warn(err);
    });

    DBOpenReq.addEventListener('success', (ev) => {
        db = ev.target.result;
        console.log('success', db)
        buildList();
    });

    //executes when new version is detected.
    //DDL only here possible
    DBOpenReq.addEventListener('upgradeneeded', (ev) => {
        db = ev.target.result;
        console.log(`database upgraded from version ${ev.oldVersion} to version ${ev.newVersion}`)
        console.log('upgrade', db)

        //only create objectStore 'Notizen' if it doesent already exist
        if (!db.objectStoreNames.contains('Notizen')){
            objectStore = db.createObjectStore('Notizen', {
                keyPath: 'id',
                autoIncrement: 'true'
            });
        }
    });

    //---------------delete note--------------------------------------------------------------------------------
    deleteButton.addEventListener('click', (e) => {
        let selectedItems = document.getElementsByClassName('selected');
        if (selectedItems.length > 0) {
            let tx = makeTX('Notizen', 'readwrite');
            tx.oncomplete =  (e) => {
                console.log(e);
            }
            let store = tx.objectStore('Notizen');
            let request = store.delete(parseInt(selectedItems[0].firstElementChild.textContent));
            request.onsuccess = (e) => {
                clearList();
                buildList();
                clearNote();
            }
            request.onerror = (err) => {
                console.warn(err);
            }
        } else {
            console.log('No item is selected');
        }
    });

    //----------------open edit page----------------------------------------------------------------------------
    editButton.addEventListener('click', (e) => {
        let selected = document.getElementsByClassName('selected');
        if (selected.length > 0) {
            selected = selected[0]

            let tx = makeTX('Notizen', 'readonly');
            tx.oncomplete = (e) => {

            }
            let store = tx.objectStore('Notizen');
            let request = store.get(parseInt(selected.firstElementChild.textContent));
            request.onsuccess = (e) => {
                console.log();
                editedContent.value = e.target.result.inhalt;
                editedTitle.value = e.target.result.titel;
                editPage.style.transform = 'TranslateY(100%)';
            }
            request.onerror = (err) => {
                console.warn(err);
            }
        }
    });

    //-----------------Save edit---------------------------------------
    saveEditButton.addEventListener('click', (e) => {
        e.preventDefault();
        let selected = document.getElementsByClassName('selected');
        if (selected.length > 0) {
            selected = selected[0]

            let tx = makeTX('Notizen', 'readwrite');
            tx.oncomplete = (e) => {

            }
            let store = tx.objectStore('Notizen');
            let request = store.put({
                id: parseInt(selected.firstElementChild.textContent),
                titel: editedTitle.value,
                inhalt: editedContent.value,
                erstellt: Date.now()
            });
            request.onsuccess = (e) => {
                editPage.style.transform = 'translateY(0)';
                clearList();
                buildList();
                clearNote();
            }
            request.onerror = (err) => {
                console.warn(err);
            }
        }
    });

    //---------------save new note------------------------------------------------------------------------------
    addPage.addEventListener('submit', saveNewNote);

    function saveNewNote(e) {
        e.preventDefault(); //stop default behaviour of form. prevents the page from refreshing.
        addPage.style.transform = 'translateY(0)';
        let title = newTitle.value.trim();
        let content = newContent.value.trim();
        let createdAt = Date.now();

        let newNote = {
            titel: title,
            inhalt: content,
            erstellt: createdAt
        }

        //transaction for submitting the new data to the store
        let tx = makeTX('Notizen', 'readwrite');

        tx.oncomplete = (e) => {
            console.log(e);
        }

        let store = tx.objectStore('Notizen');
        let request = store.add(newNote)

        request.onsuccess = (e) => {
            console.log('Added new Note');
            clearList();
            buildList();
        }
        request.onerror = (err) => {
            console.warn(err);
        }
    }

    function makeTX(storeName, mode, ) {
        let tx = db.transaction(storeName, mode);
        tx.onerror = (err) => {
            console.warn(err);
        }
        return tx;
    }

    function clearList() {
        list.innerHTML = '<div class="listTitle">Notizen</div>';
    }

    function buildList() {
        list.innerHTML = '<div class="listTitle">Lade...</div>';

        let tx = makeTX('Notizen', 'readonly');
        tx.oncomplete = (e) => {
            // the whole transaction is complete
        }
        let store = tx.objectStore('Notizen');
        let getReq = store.getAll();

        getReq.onsuccess = (e) => {
            //getAll was succesfull
            list.innerHTML = '<div class="listTitle">Notizen</div>';
            for (let i = 0; i < e.target.result.length; i++) {
                list.insertAdjacentHTML('beforeend', `<div class="listItem">${e.target.result[i].titel}<div style='display: none;'>${e.target.result[i].id}</div></div>`);
            }
            let listItems = document.getElementsByClassName('listItem');
            //generate new event listeners
            for (let i = 0; i < listItems.length; i++) {
                listItems[i].addEventListener('click', switchItem);
                listItems[i].addEventListener('click', playClickAnimation);
            }
        }

        getReq.onerror = (err) => {
            console.warn(err);
        }
    }

    function switchItem() {
        for (let i = 0; i < listItems.length; i++) {
            listItems[i].classList.remove('selected');
        }
        this.classList.add('selected');
        console.log(this.firstElementChild.textContent);

        let tx = makeTX('Notizen', 'readonly');
        tx.oncomplete = (e) => {

        }
        let store = tx.objectStore('Notizen');
        let getReq = store.get(parseInt(this.firstElementChild.textContent));

        getReq.onsuccess = (e) => {
            console.log(e.target.result)
            noteTitle.innerHTML = '<span id="noteTitleArrow" style="user-select: none;">&#8612;</span>';
            noteTitle.insertAdjacentText('beforeend', e.target.result.titel);
            noteContent.innerText = e.target.result.inhalt;
        }

        getReq.onerror = (err) => {
            console.warn(err);
        }

    }

    function clearNote() {
        //delete text of noteTitle without affecting its children and their text
        let child = noteTitle.firstChild
        let nextChild;

        while (child) {
        nextChild = child.nextSibling;
        if (child.nodeType === 3) {
            noteTitle.removeChild(child);
        }
        child = nextChild;
        }

        noteContent.textContent = '';
    }
})();

