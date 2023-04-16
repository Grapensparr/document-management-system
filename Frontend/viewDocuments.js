const main = document.getElementById('main');

export function viewDocumentsList() {    
    const documentListHeader = document.createElement('div');
    documentListHeader.classList.add('documentListHeader');
    
    const title = document.createElement('div');
    title.innerText = 'Document title';
    
    const latestUpdate = document.createElement('div');
    latestUpdate.innerText = 'Latest update';
    
    documentListHeader.append(title, latestUpdate);
    main.appendChild(documentListHeader);
    
    const documentsList = document.createElement('ul');
    documentsList.classList.add('documentList');
  
    fetch('http://localhost:3000/documents/listDocuments')
    .then(res => res.json())
    .then(data => {
        data.sort((a, b) => new Date(b.latestUpdate) - new Date(a.latestUpdate));
    
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('listItem');
            listItem.addEventListener('click', () => {
                documentDetails(item.documentId);
            });
    
            const itemTitle = document.createElement('p');
            itemTitle.innerText = `${item.documentTitle}`;
            
            const updateDate = document.createElement('p');
            updateDate.innerText = `${new Date(item.latestUpdate).toISOString().substr(0, 10)}`;
            
            listItem.append(itemTitle, updateDate);
            documentsList.appendChild(listItem);
            main.appendChild(documentsList);
        });
    })
    .catch(err => {
        console.error(err);
    });
}

function documentDetails(documentId) {
    main.innerHTML = '';
  
    const documentMenu = document.createElement('div');
    documentMenu.classList.add('documentMenu');

    const viewDocument = document.createElement('button');
    viewDocument.classList.add('menuBtn');
    viewDocument.innerText = 'View document';
    viewDocument.addEventListener('click', () => {
        printDocument(documentId);
    });

    const editDocument = document.createElement('button');
    editDocument.classList.add('menuBtn');
    editDocument.innerText = 'Edit document';
    editDocument.addEventListener('click', () => {
        printEditor(documentId);
    });

    const viewChangeHistory = document.createElement('button');
    viewChangeHistory.classList.add('menuBtn');
    viewChangeHistory.innerText = 'View change history';
    viewChangeHistory.addEventListener('click', () => {
        printChangeHistory(documentId);
    });

    documentMenu.append(viewDocument, editDocument, viewChangeHistory);
    main.appendChild(documentMenu);
  
    const documentInfo = document.createElement('div');
    const documentTitle = document.createElement('div');
    const documentContent = document.createElement('div');
  
    fetch(`http://localhost:3000/documents/${documentId}`)
    .then(res => res.json())
    .then(data => {
        documentTitle.innerHTML = `<h1>${data.documentTitle}</h1>`;
        documentContent.innerHTML = data.content;
    })
    .catch(err => {
        console.error(err);
    });

    documentInfo.append(documentTitle, documentContent);
    
    main.append(documentInfo);
}

function printDocument(documentId) {
    const documentInfo = document.createElement('div');
    const documentTitle = document.createElement('div');
    const documentContent = document.createElement('div');
  
    fetch(`http://localhost:3000/documents/${documentId}`)
    .then(res => res.json())
    .then(data => {
        documentTitle.innerHTML = `<h1>${data.documentTitle}</h1>`;
        documentContent.innerHTML = data.content;
    })
    .catch(err => {
        console.error(err);
    });
  
    documentInfo.append(documentTitle, documentContent);

    main.removeChild(main.lastChild);
    main.append(documentInfo);
}

function printEditor(documentId) {
    const documentInfo = document.createElement('div');

    const documentTitle = document.createElement('input');
    documentTitle.classList.add('updatedDocumentTitle');
    documentTitle.placeholder = 'Document title';

    const documentContent = document.createElement('textarea');
    documentContent.classList.add('updatedDocumentContent');
    documentContent.placeholder = 'Add document content here';
  
    fetch(`http://localhost:3000/documents/${documentId}`)
    .then(res => res.json())
    .then(data => {
        documentTitle.value = data.documentTitle;
        documentContent.innerHTML = data.content;
    })
    .catch(err => {
        console.error(err);
    });

    const saveDocumentBtn = document.createElement('button');
    saveDocumentBtn.classList.add('saveDocumentBtn');
    saveDocumentBtn.innerText = 'Save changes';
    saveDocumentBtn.addEventListener('click', () => {        
        fetch('http://localhost:3000/documents/saveChange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documentId: documentId,
                changeTitle: documentTitle.value,
                changeContent: documentContent.value,
                changeAuthor: localStorage.getItem('loggedInUser')
            })
        })
        .then(res => res.json())
        .then(id => {
            console.log(id);
            const confirmationMessage = document.createElement('p');
            confirmationMessage.classList.add('confirmationMessage');
            confirmationMessage.innerText = 'Your changes were successfully saved';
            documentInfo.appendChild(confirmationMessage)
            
            setTimeout(() => {
                confirmationMessage.remove();
            }, 5000);
        })
        .catch(err => {
            console.error(err);
        });
    });

    const cancelChangesBtn = document.createElement('button');
    cancelChangesBtn.classList.add('cancelChangesBtn');
    cancelChangesBtn.innerText = 'Cancel changes';
    cancelChangesBtn.addEventListener('click', () => {
        printEditor(documentId);
    }); 
  
    documentInfo.append(documentTitle, documentContent, saveDocumentBtn, cancelChangesBtn);

    main.removeChild(main.lastChild);
    main.append(documentInfo);

    tinymce.init ({
        selector: '.updatedDocumentContent',
        plugin: 'code',
        toolbar: 'undo redo | fontfamily fontsize | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent',
    
        setup: function(editor) {
            editor.on('change', function() {
                editor.save();
            });
        }
    });
}

function printChangeHistory(documentId) {
    const changeHistoryContainer = document.createElement('div');

    const changeHistoryHeader = document.createElement('h1');
    changeHistoryHeader.innerText = 'Changes made to this document:';
    changeHistoryContainer.append(changeHistoryHeader);

    const changeHistoryList = document.createElement('ul');

    fetch(`http://localhost:3000/documents/changeHistory/${documentId}`)
    .then(res => res.json())
    .then(data => {
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.changeHistory;

            changeHistoryList.appendChild(listItem);
            changeHistoryContainer.appendChild(changeHistoryList);
        });
    })
    .catch(err => {
        console.error(err);
    });

    main.removeChild(main.lastChild);
    main.append(changeHistoryContainer);
}