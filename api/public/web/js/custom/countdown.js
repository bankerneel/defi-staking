$.get('/dashboard/stake-time/', async (result) => {
  if (result.message == 'Success' && result.data != '') {
    $('#contain').removeClass('hideDiv');
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const localDateTime = new Date(result.data);
    const countDown = new Date(localDateTime.toString()).getTime();
    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = now - countDown;

      document.getElementById('days').innerText = Math.floor(distance / (day));
      document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour));
      document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute));
      // document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / (second));

      // do something later when date is reached
      // if (distance < 0) {
      //  clearInterval(x);
      //  'IT'S MY BIRTHDAY!;
      // }
    });
  } else {
    $('#contain').addClass('hideDiv');
  }
});
