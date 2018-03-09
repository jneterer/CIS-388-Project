function validateForm() {
  var book_title = document.forms['new_quote_form']['quote_title'].value;
    var book_title = document.forms['new_quote_form']['quote'].value;
  if (book_title === '' || quote === '') {
    alert('All required fields must be filled out!');
    return false;
  }
  return true;
}
