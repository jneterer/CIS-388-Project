function makeEditable() {
  document.getElementById('note_title').disabled = false;
  document.getElementById('note').disabled = false;
  document.getElementById('cancel_edit').disabled = false;
  document.getElementById('save').disabled = false;
}

function cancelEdit() {
  var r = confirm("Are you sure you want to cancel? All progress will be lost.");
  if (r === true) {
    document.getElementById('manage_note_form').reset();
    document.getElementById('note_title').disabled = true;
    document.getElementById('note').disabled = true;
    document.getElementById('cancel_edit').disabled = true;
    document.getElementById('save').disabled = true;
  }
}

function validateDeleteForm() {
  var r = confirm("Are you sure you want to delete this note? The note will be lost.");
  if (r === false) {
    return false;
  }
  return true;
}
