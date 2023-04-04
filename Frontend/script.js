import createNewDocument from "./createNewDocument.js";

tinymce.init ({
    selector: '#documentContent',
    toolbar: 'undo redo | fontfamily fontsize | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent',

    setup: function(editor) {
        editor.on('change', function() {
            editor.save();
        });
    }
});

localStorage.setItem('loggedInUser', 'Liza');