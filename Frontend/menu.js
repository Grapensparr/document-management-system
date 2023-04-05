import { createNewDocument } from "./createNewDocument.js";
import { viewDocumentsList } from "./viewDocuments.js";

const newDocumentContainer = document.querySelector('newDocumentContainer');

export function printMenuOptions() {
    const main = document.getElementById('main');
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btnContainer');

    const createDocumentOption = document.createElement('button');
    createDocumentOption.classList.add('menuBtn');
    createDocumentOption.addEventListener('click', () => {
        main.innerHTML = '';
        main.append(btnContainer);
        createNewDocument();
        localStorage.setItem('selectedOption', 'createDocument');
    });

    const viewDocuments = document.createElement('button');
    viewDocuments.classList.add('menuBtn');
    viewDocuments.addEventListener('click', () => {
        main.innerHTML = '';
        main.append(btnContainer);
        viewDocumentsList();
        localStorage.setItem('selectedOption', 'viewDocument');
    });

    createDocumentOption.innerText = 'Create new document';
    viewDocuments.innerText = 'View and edit existing documents';

    btnContainer.append(createDocumentOption, viewDocuments);
    main.appendChild(btnContainer);
}