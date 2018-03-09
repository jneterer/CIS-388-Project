function validateForm() {
  var book_title = document.forms['new_quote_form']['quote_title'].value;
    var book_title = document.forms['new_quote_form']['quote'].value;
  if (book_title === '' || quote === '') {
    alert('You must have entered all required fields title!');
    return false;
  }
  return true;
}
