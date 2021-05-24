export const setCartToken = (token: string) => {
  if(token === undefined) return;
  try {
    localStorage.setItem('_ODD_cart', token);
  } catch (e) {
    // saving error
  }
};

export const getCartToken = () => {
  try {
    const value = localStorage.getItem('_ODD_cart');
    if (value !== null) {
      // value previously stored
    }
    return value;
  } catch (e) {}
  return '';
};

export const setCustomerTokens = ({
  csrf,
  refresh,
  access,
}: {
  csrf: string;
  refresh: string;
  access: string;
}) => {
  try {
    localStorage.setItem('_ODD_csrf', csrf);
    localStorage.setItem('_ODD_refresh', refresh);
    localStorage.setItem('_ODD_access', access);
  } catch (e) {
    // saving error
  }
};

export const getCustomerTokens = () => {
  try {
    let csrf = localStorage.getItem('_ODD_csrf');
    let refresh = localStorage.getItem('_ODD_refresh');
    let access = localStorage.getItem('_ODD_access');
    return {
      csrf,
      refresh,
      access,
    };
  } catch (e) {
    // saving error
  }
};
