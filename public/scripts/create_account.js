function validateForm() {
  var first_name = document.forms['create_account_form']['first_name'].value;
  var last_name = document.forms['create_account_form']['last_name'].value;
  var email = document.forms['create_account_form']['email'].value;
  var password = document.forms['create_account_form']['password'].value;
  var confirmPassword = document.forms['create_account_form']['confirmPassword'].value;
  if (first_name === '' || last_name === '' || email === '' || password === '' || confirmPassword === '') {
    alert('All required fields must be filled out!');
    return false;
  } else if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return false;
  }
  return true;
}
