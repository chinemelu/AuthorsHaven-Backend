const constants = {
  emailVerification: {
    subject: "Welcome to Author's Haven",
    text: "Thank you for signing up to Author's Haven,"
    + ' please verify your email by clicking on the link below. The link will'
    + ' expire in 12 hours'
  },
  resetPassword: {
    subject: 'Password reset request for Author\'s Haven',
    text: "A password request has been sent for your account on Author's Haven."
    + ' Click on the link below to reset your password.'
    + 'The link expires in 1 hour. If you didn\'t request for this password,'
    + ' ignore this message.'
  },
  articleEnums: Object.freeze({
    HAS_ACCESS: 'hasAccess',
    BOOKMARK: 'bookmark'
  })
};

export default constants;
