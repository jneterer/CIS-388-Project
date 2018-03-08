function makeEditable() {
  document.getElementById('quote_title').disabled = false;
  document.getElementById('quote').disabled = false;
  document.getElementById('cancel_edit').disabled = false;
  document.getElementById('save').disabled = false;
}

function cancelEdit() {
  var r = confirm("Are you sure you want to cancel? All progress will be lost.");
  if (r === true) {
    document.getElementById('manage_quote_form').reset();
    document.getElementById('quote_title').disabled = true;
    document.getElementById('quote').disabled = true;
    document.getElementById('cancel_edit').disabled = true;
    document.getElementById('save').disabled = true;
  }
}

function validateForm() {
  var r = confirm("Are you sure you want to delete this note? The note will be lost.");
  if (r === false) {
    return false;
  }

  return true;
}
