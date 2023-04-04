const createNewDocument = document.getElementById('createNewDocument');

export default createNewDocument.addEventListener('submit', (event) => {
    event.preventDefault();

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
    .then(documentId => {
        console.log(`Created document with ID ${documentId}`);
    })
    .catch(err => {
        console.error(err);
    });
});