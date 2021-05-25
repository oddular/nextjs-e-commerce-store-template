import dayjs from 'dayjs'

const MOBILE_PHONE_VALIDATOR = /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/;
const EMAIL_VALIDATOR = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const defaultMaxEmailLength = 254;
const defaultMinEmailLength = 4;

export function isPhone(phone) {
  return MOBILE_PHONE_VALIDATOR.test(phone);
}

export function isEmail(email) {
  if (
    email.length > defaultMaxEmailLength ||
    email.length < defaultMinEmailLength
  ) {
    return false;
  }
  return EMAIL_VALIDATOR.test(email);
}

export function yiq(colorHex) {
  if (colorHex.length === 4) {
    colorHex = colorHex.replace(/^#(.)(.)(.)/i, '#$1$1$2$2$3$3');
  }

  const n = parseInt(colorHex.slice(1), 16);

  const r = (n & 0xff0000) >> 16;
  const g = (n & 0xff00) >> 8;
  const b = n & 0xff;

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128;
}

export function colorYiq(colorHex) {
  const light = '#fff';
  const dark = '#000';
  return yiq(colorHex) ? dark : light;
}

export function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  var to = 'aaaaeeeeiiiioooouuuunc------';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

export function unslugify(str) {
  return str.replace(/[a-z][a-z]*-?/g,([f, ...rest]) => f.toUpperCase() + rest.join('').replace('-', ' '));
}


const PRETTY_DATE_TIME_FORMAT_STRING = 'ddd MM/DD/YYYY hh:mmA';
export function prettyDateTime(str) {
  return dayjs(str).format(PRETTY_DATE_TIME_FORMAT_STRING);
}
