import { createNewDocument } from "./createNewDocument.js";
import { viewDocumentsList } from "./viewDocuments.js";

export function printMenuOptions() {
    const main = document.getElementById('main');
    const menu = document.getElementById('menu');
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btnContainer');

    const createDocumentOption = document.createElement('button');
    createDocumentOption.classList.add('menuBtn');
    createDocumentOption.addEventListener('click', () => {
        main.innerHTML = '';
        createNewDocument();
        localStorage.setItem('selectedOption', 'createDocument');
    });

    const viewDocuments = document.createElement('button');
    viewDocuments.classList.add('menuBtn');
    viewDocuments.addEventListener('click', () => {
        main.innerHTML = '';
        viewDocumentsList();
        localStorage.setItem('selectedOption', 'viewDocument');
    });

    createDocumentOption.innerText = 'Create new document';
    viewDocuments.innerText = 'View and edit existing documents';

    btnContainer.append(createDocumentOption, viewDocuments);
    menu.appendChild(btnContainer);
}