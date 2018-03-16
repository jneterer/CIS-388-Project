function validateReturnBookForm() {
  var date_returned = document.forms['return_book']['date_returned'].value;
  if (date_returned === '') {
    alert('You must have entered a date the book was returned!');
    return false;
  }
  return true;
}
