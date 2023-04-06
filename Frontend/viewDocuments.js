export function viewDocumentsList() {
    const main = document.getElementById('main');
    
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
            link.href = `http://localhost:3000/documents/${item.documentId}`;
            link.innerText = `${item.documentTitle}`;
            
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