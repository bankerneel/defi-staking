$(document).ready(() => {
  const transactionTable = $('#transaction-table').DataTable({
    dom: 'lTfgt<"bottom"ip>',
    ajax: {
      url: '/admin/transaction/get-transactions',
    },
    columnDefs: [
      { width: '45%', targets: 0 },
      { width: '15%', targets: 1 },
      { width: '20%', targets: 2 },
      { width: '20%', targets: 3 },
    ],
    columns: [
      {
        data: 'userAddresses',
      },
      {
        data: 'userStakedTokens',
      },
      {
        data: 'userRewardsEarned',
      },
      {
        data: 'userStakingTime',
      },
    ],
  });

  setInterval(() => {
    transactionTable.ajax.reload(null, false);
  }, 20000);
});

$('.input-group.date').datepicker({
  format: 'dd.mm.yyyy',
});
const datePicker = $('.calendar').datepicker({});
let t;
$(document).on('DOMMouseScroll mousewheel scroll', '#myModal', () => {
  window.clearTimeout(t);
  t = window.setTimeout(() => {
    $('.calendar').datepicker('');
  }, 100);
});
