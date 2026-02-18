exports.generateUsername = (email) => {
    const base = email.split("@")[0];
    const random = Math.floor(100 + Math.random() * 900);
    return base + random;
  };
  