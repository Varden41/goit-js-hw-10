import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import fetchCountries from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const { input, countryList, countryInfo } = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

input.addEventListener(
  'input',
  debounce(e => {
    const inputTarget = e.target.value.trim();
    if (!inputTarget) {
      return clearMarkup();
    }

    fetchCountries(inputTarget).then(createMarkup).catch(onError);
  }, DEBOUNCE_DELAY)
);
function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
function createMarkup(data) {
  if (data.length > 10) {
    clearMarkup();
    Notify.info('"Too many matches found. Please enter a more specific name."');
  } else if (data.length >= 2 && data.length < 10) {
    markupList(data);
  } else {
    markupCountry(data);
  }
}
function onError() {
  Notify.failure('Oops, there is no country with that name');
}

function markupList(data) {
  clearMarkup();
  const markup = data
    .map(country => {
      return `<li style="font-size: 16px"><img src="${country.flags.svg}" alt="flag" width = "50px" height ="30px">${country.name.official}</li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}
function markupCountry(data) {
  clearMarkup();
  countryInfo.innerHTML = `<p style="font-size: 42px"><img src="${
    data[0].flags.svg
  }" alt="flag"  width = "50px" height ="30px"/>${data[0].name.official}</p>
<p><b>Capital:</b>${data[0].capital}</p>
<p><b>Population:</b>${data[0].population}</p>
<p><b>Languages:</b>${Object.values(data[0].languages)}</p>`;
}
