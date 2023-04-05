import { printLoginForm, printLogoutBtn } from './userform.js';
import { printMenuOptions } from "./menu.js";
import { createNewDocument } from './createNewDocument.js';
import { viewDocumentsList } from './viewDocuments.js';

const loggedIn = localStorage.getItem('loggedInUser');
const selectedOption = localStorage.getItem('selectedOption');

if(loggedIn) {
    printLogoutBtn();
    printMenuOptions();

    if(selectedOption === 'createDocument') {
        createNewDocument();
    } else if(selectedOption === 'viewDocument') {
        viewDocumentsList();
    }
} else {
    printLoginForm();
}