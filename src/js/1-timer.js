import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('[data-start]');
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');
btnStart.disabled = true;
let userDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const date = selectedDates[0];
    const now = new Date();

    if (date <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      btnStart.disabled = true;
      return;
    }

    userDate = date;
    btnStart.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

btnStart.addEventListener('click', startTimer);

function startTimer() {
  btnStart.disabled = true;
  input.disabled = true;

  intervalId = setInterval(() => {
    const now = Date.now();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      updateUI(0, 0, 0, 0);
      clearInterval(intervalId);
      input.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);
    updateUI(days, hours, minutes, seconds);
  }, 1000);
}

function updateUI(d, h, m, s) {
  days.textContent = addLeadingZero(d);
  hours.textContent = addLeadingZero(h);
  minutes.textContent = addLeadingZero(m);
  seconds.textContent = addLeadingZero(s);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
