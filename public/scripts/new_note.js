function validateForm() {
  var book_title = document.forms['new_note_form']['note_title'].value;
    var book_title = document.forms['new_note_form']['note'].value;
  if (book_title === '' || quote === '') {
    alert('You must have entered all required fields title!');
    return false;
  }
  return true;
}
