export const normalizeUser = (user) => ({
  id: user.id || user._id,
  _id: user._id || user.id,
  username: user.username || user.name || "Sin nombre",
  email: user.email || "Sin email",
  image: user.image || "",
});

export const saveUserToStorage = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  if (token) localStorage.setItem("token", token);
};

export const clearStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const getSafeJSON = (key) => {
  const item = localStorage.getItem(key);
  if (!item || item === "undefined") return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage`, e);
    return null;
  }
};