import bcrypt, { hash } from "bcrypt";
const saltRounds = 10;

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error(err);
    throw new Error("Password hashing failed");
  }
};

export const checkPassword = async (password, dbpassword) => {
  return await bcrypt.compare(password, dbpassword);
};
