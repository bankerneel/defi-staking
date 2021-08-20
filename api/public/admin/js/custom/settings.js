function depositReward(event) {
  const form = $('#deposit-reward-form');
  const formData = form.serialize();
  const validator = form.validate({
    rules: {
      depositRewardAmount: {
        required: true,
      },
    },
  });

  if (form.valid()) {
    $('#deposit-reward-form #deposit-loader').addClass('loader');
    $(event).prop('disabled', true);
    $.ajax({
      url: '/admin/settings/deposit-reward',
      data: formData,
      method: 'post',
      success(result) {
        if (result.status == 1) {
          $(event).prop('disabled', false);
          $('#deposit-reward-form #deposit-loader').removeClass('loader');
          $('#successModal .title').html('Deposited Tokens Successfully !');
          $('#successModal').modal('show');
          setTimeout(() => {
            window.location.replace('/admin/settings');
          }, 3000);
        } else {
          swal({ title: '', text: 'Someting went wrong! ' });
        }
      },
    });
  } else {
    validator.focusInvalid();
  }
}

function withdrawReward(event) {
  const form = $('#withdraw-reward-form');
  const formData = form.serialize();
  const validator = form.validate({
    rules: {
      withdrawRewardAmount: {
        required: true,
      },
    },
  });

  if (form.valid()) {
    $('#withdraw-reward-form #withdraw-loader').addClass('loader');
    $(event).prop('disabled', true);
    $.ajax({
      url: '/admin/settings/withdraw-reward',
      data: formData,
      method: 'post',
      success(result) {
        if (result.status == 1) {
          $(event).prop('disabled', false);
          $('#withdraw-reward-form #withdraw-loader').removeClass('loader');
          $('#successModal .title').html('Withdrawn Tokens Successfully !');
          $('#successModal').modal('show');
          setTimeout(() => {
            window.location.replace('/admin/settings');
          }, 3000);
        } else {
          swal({ title: '', text: 'Someting went wrong! ' });
        }
      },
    });
  } else {
    validator.focusInvalid();
  }
}
