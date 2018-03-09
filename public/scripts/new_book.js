function validateForm() {
  var book_title = document.forms['new_book_form']['book_title'].value;
  if (book_title === '') {
    alert('You must have entered a book title!');
    return false;
  }
  return true;
}
