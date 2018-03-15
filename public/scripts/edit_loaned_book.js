function makeEditable() {
  document.getElementById('loaned_to').disabled = false;
  document.getElementById('new_date_loaned').disabled = false;
  document.getElementById('phone').disabled = false;
  document.getElementById('email').disabled = false;
  document.getElementById('comments').disabled = false;
  document.getElementById('cancel_edit').disabled = false;
  document.getElementById('save').disabled = false;
}

function cancelEdit() {
  var r = confirm("Are you sure you want to cancel? All progress will be lost.");
  if (r === true) {
    document.getElementById('edited_loaned_book_form').reset();
    document.getElementById('loaned_to').disabled = true;
    document.getElementById('new_date_loaned').disabled = true;
    document.getElementById('phone').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('comments').disabled = true;
    document.getElementById('cancel_edit').disabled = true;
    document.getElementById('save').disabled = true;
  }
}

function validateEditLoanForm() {
  var loaned_to = document.forms['edited_loaned_book_form']['loaned_to'].value;
  if (loaned_to === '') {
    alert('You must have entered who you loaned the book to!');
    return false;
  }
  return true;
}

function validateDeleteForm() {
  var r = confirm("Are you sure you want to delete this book? The book along with its notes and quotes will be lost.");
  if (r === false) {
    return false;
  }
  return true;
}
