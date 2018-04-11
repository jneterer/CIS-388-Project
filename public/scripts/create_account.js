function validateForm() {
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return false;
  }
  return true;
}
