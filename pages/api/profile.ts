export const setCustomerProfile = (customer) => {
  try {
    localStorage.setItem(
      '_ODD_customer_profile',
      JSON.stringify(customer),
    );
  } catch (e) {
    // saving error
  }
};

export const getCustomerProfile = () => {
  try {
    const profileAsString = localStorage.getItem('_ODD_customer_profile');
    if (!!profileAsString) {
      return JSON.parse(profileAsString);
    }
  } catch (e) {
    // saving error
  }
  return {};
};
