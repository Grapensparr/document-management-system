import createNewDocument from "./createNewDocument.js";
import { printLoginForm, printLogoutBtn } from './userform.js';

const loggedIn = localStorage.getItem('loggedInUser');
if(loggedIn) {
    printLogoutBtn();
} else {
    printLoginForm();
}

tinymce.init ({
    selector: '#documentContent',
    toolbar: 'undo redo | fontfamily fontsize | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent',

    setup: function(editor) {
        editor.on('change', function() {
            editor.save();
        });
    }
});