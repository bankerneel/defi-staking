function authLogin() {
  const form = $('#login-form');
  const formData = form.serialize();

  const validator = form.validate({
    rules: {
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
      },
    },
  });

  if (form.valid()) {
    $.ajax({
      url: '/admin/authentication',
      data: formData,
      method: 'post',
      success(result) {
        if (result.status == 1) {
          window.location.replace('/admin/transaction');
        } else {
          $('.errorMessage').html(result.message);
        }
      },
    });
  } else {
    validator.focusInvalid();
  }
}
