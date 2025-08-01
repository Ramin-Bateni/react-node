const SUPER_ADMIN = "superadmin";

const checkSuperAdmin = (role) => {
  return (role ?? "").toLowerCase() === SUPER_ADMIN;
};

module.exports = {
  checkSuperAdmin,
};
