export function createNewDocument() {
    const main = document.getElementById('main');
    const newDocumentContainer = document.createElement('div');
    newDocumentContainer.classList.add('newDocumentContainer');
    newDocumentContainer.innerHTML = '';

    const newDocumentTitle = document.createElement('input');
    newDocumentTitle.classList.add('newDocumentTitle');
    newDocumentTitle.placeholder = 'Document title';

    const newDocumentContent = document.createElement('textarea');
    newDocumentContent.classList.add('newDocumentContent');
    newDocumentContent.placeholder = 'Add document content here';

    const createDocumentBtn = document.createElement('button');
    createDocumentBtn.classList.add('createDocumentBtn');
    createDocumentBtn.innerText = 'Create new document';
    createDocumentBtn.addEventListener('click', () => {        
        fetch('http://localhost:3000/createDocuments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newDocumentTitle: newDocumentTitle.value, newDocumentContent: newDocumentContent.value, newDocumentAuthor: localStorage.getItem('loggedInUser') })
        })
        .then(res => res.json())
        .then(documentId => {
            console.log(`Created document with ID ${documentId}`);
        })
        .catch(err => {
            console.error(err);
        });
    });

    newDocumentContainer.append(newDocumentTitle, newDocumentContent, createDocumentBtn);

    main.append(newDocumentContainer);

    tinymce.init ({
        selector: '.newDocumentContent',
        toolbar: 'undo redo | fontfamily fontsize | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent',
    
        setup: function(editor) {
            editor.on('change', function() {
                editor.save();
            });
        }
    });
}