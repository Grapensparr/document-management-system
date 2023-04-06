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
    
            const link = document.createElement('a');
            link.innerText = `${item.documentTitle}`;
            link.addEventListener('click', () => {
                documentDetails(item.documentId);
            });
            
            const updateDate = document.createElement('div');
            updateDate.innerText = `${new Date(item.latestUpdate).toISOString().substr(0, 10)}`;
            
            listItem.append(link, updateDate);
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
        documentTitle.innerHTML = data.documentTitle;
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
        documentTitle.innerHTML = data.documentTitle;
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
    console.log('placeholder');
}

function printChangeHistory(documentId) {
    console.log('placeholder');
}