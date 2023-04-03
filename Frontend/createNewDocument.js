const createNewDocument = document.getElementById('createNewDocument');

export default createNewDocument.addEventListener('submit', () => {
  const title = document.getElementById('documentTitle');
  const content = document.getElementById('documentContent');
  
    fetch('http://localhost:3000/createDocuments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newDocumentTitle: title.value, newDocumentContent: content.value, newDocumentAuthor: localStorage.getItem('loggedInUser') })
    })
    .then(res => res.json())
    .then(data => {
        console.log(`Created document with ID ${data.document_id}`);
        printTodos(listDrop.value);
    })
    .catch(err => {
        console.error(err);
    });
});