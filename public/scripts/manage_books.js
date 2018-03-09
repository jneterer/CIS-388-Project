function makeEditable() {
  document.getElementById('book_title').disabled = false;
  document.getElementById('authors').disabled = false;
  document.getElementById('ISBN').disabled = false;
  document.getElementById('gift_first_name').disabled = false;
  document.getElementById('gift_last_name').disabled = false;
  document.getElementById('cancel_edit').disabled = false;
  document.getElementById('save').disabled = false;
}

function cancelEdit() {
  var r = confirm("Are you sure you want to cancel? All progress will be lost.");
  if (r === true) {
    document.getElementById('manage_book_form').reset();
    document.getElementById('book_title').disabled = true;
    document.getElementById('authors').disabled = true;
    document.getElementById('ISBN').disabled = true;
    document.getElementById('gift_first_name').disabled = true;
    document.getElementById('gift_last_name').disabled = true;
    document.getElementById('cancel_edit').disabled = true;
    document.getElementById('save').disabled = true;
  }
}

function validateDeleteForm() {
  var r = confirm("Are you sure you want to delete this book? The book along with its notes and quotes will be lost.");
  if (r === false) {
    return false;
  }

  return true;
}

function validateManageBookForm() {
  var book_title = document.forms['manage_book_form']['book_title'].value;
  if (book_title === '') {
    alert('You must have entered a book title!');
    return false;
  }
  return true;
}
