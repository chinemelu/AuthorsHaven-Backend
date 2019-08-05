const sanitizeNameInput = (name) => {
  const trimmedName = name.trim();
  const firstLetter = trimmedName.substring(0, 1);
  const capitalizedFirstLetter = firstLetter.toUpperCase();
  const otherLetters = trimmedName.substring(1).toLowerCase();
  const requiredName = `${capitalizedFirstLetter}${otherLetters}`;
  return requiredName;
};

export default sanitizeNameInput;
