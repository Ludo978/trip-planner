const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { UserModel } = require('../database');

const createUser = async ({ body }) => {
  const { username, email, password } = body;
  if (!username || !email || !password)
    return {
      status: 400,
      data: { message: 'Missing data' },
    };

  const existingEmail = await UserModel.findOne({ email });
  if (existingEmail) {
    return {
      status: 409,
      data: { message: 'Adresse email déjà utilisée' },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let user;
  try {
    user = await UserModel.create({
      ...body,
      password: hashedPassword,
    });
  } catch (error) {
    console.log(error);
  }
  if (user)
    return { status: 201, data: { message: 'User successfully created' } };
  else return { status: 500, data: { message: 'An error occured' } };
};

const updateUser = async ({ body }) => {
  let user;
  try {
    user = await UserModel.findById(body.user?.id);
  } catch (error) {
    console.log(error);
  }
  if (!user) return { status: 404, data: { message: 'User not found' } };
  if (body.username) user.username = body.username;
  if (body.address) {
    const { street, zipcode, city, country } = body.address;
    if (!street || !zipcode || !city || !country)
      return {
        status: 400,
        data: { message: 'Invalid address format' },
      };
    user.address = body.address;
  }
  if (body.password) user.password = await bcrypt.hash(body.password, 10);
  user.save();
  return { status: 200, data: { message: 'User successfully updated' } };
};

const getProfile = async ({ body }) => {
  let user;
  try {
    user = await UserModel.findById(body.user?.id, '-password -__v');
  } catch (error) {
    console.log(error);
  }
  if (!user) return { status: 404, data: { message: 'User not found' } };
  return { status: 200, data: { user } };
};

const deleteUser = async ({ body }) => {
  let user;
  try {
    user = await UserModel.findById(body.user?.id);
  } catch (error) {
    console.log(error);
  }
  if (!user) return { status: 404, data: { message: 'User not found' } };
  try {
    await UserModel.deleteOne({ _id: body.user?.id });
  } catch (error) {
    console.log(error);
    return { status: 500, data: { message: 'An error occured' } };
  }
  return { status: 200, data: { message: 'User successfully deleted' } };
};

const login = async ({ body }) => {
  const { email, password } = body;

  const user = await UserModel.findOne({ email });
  if (!user)
    return {
      status: 404,
      data: { message: 'Email invalide' },
    };

  const validPwd = await bcrypt.compare(password, user.password);
  if (!validPwd)
    return {
      status: 401,
      data: { message: 'Mot de passe invalide' },
    };

  const token = jwt.sign({ id: user.id }, 'ICV6gy7CDKPHMGJxV80nDZ7Vxe0ciqyzXD_Hr4mTDrdTyi6fNleYAyhEZq2J29HSI5bhWnJyOBzg2bssBUKMY', { expiresIn: '7d' });

  return { status: 200, data: { token } };
};

const addBookmark = async ({ body }) => {
  const { id, name, address, lat, lng } = body;
  if (!id || !name || !address || !lat || !lng)
    return {
      status: 400,
      data: { message: 'Missing data' },
    };

  let user;
  try {
    user = await UserModel.findById(body.user?.id);
  } catch (error) {
    console.log(error);
  }
  if (!user) return { status: 404, data: { message: 'User not found' } };

  if (user.bookmarks.find((el) => el.id === id))
    return { status: 409, data: { message: 'Bookmark already added' } };
  user.bookmarks.push({ id, name, address, lat, lng });
  user.save();
  return { status: 200, data: { message: 'Bookmark successfully added' } };
};

const deleteBookmark = async ({ params, body }) => {
  const { id } = params;
  let user;
  try {
    user = await UserModel.findById(body.user?.id);
  } catch (error) {
    console.log(error);
  }
  if (!user) return { status: 404, data: { message: 'User not found' } };

  const index = user.bookmarks.findIndex((el) => el.id === id);

  if (index === -1)
    return { status: 404, data: { message: 'Bookmark not found' } };
  user.bookmarks.splice(index, 1);
  user.save();
  return { status: 200, data: { message: 'Bookmark successfully deleted' } };
};

const addBooking = async ({ params, body }) => {
  const { id } = params;
  let user;
  try {
    user = await UserModel.findById(body.user?.id);
  } catch (error) {
    console.log(error);
  }
  if (!user) return { status: 404, data: { message: 'User not found' } };

  if (user.bookingIds.includes(id))
    return { status: 409, data: { message: 'Booking already added' } };
  user.bookingIds.push(id);
  user.save();
  return { status: 200, data: { message: 'Booking successfully added' } };
};

const deleteBooking = async ({ params, body }) => {
  const { id } = params;
  let user;
  try {
    user = await UserModel.findById(body.user?.id);
  } catch (error) {
    console.log(error);
  }
  if (!user) return { status: 404, data: { message: 'User not found' } };

  if (!user.bookingIds.includes(id))
    return { status: 404, data: { message: 'Booking not found' } };
  user.bookingIds.splice(user.bookingIds.indexOf(id), 1);
  user.save();
  return { status: 200, data: { message: 'Booking successfully deleted' } };
};

module.exports = {
  createUser,
  updateUser,
  getProfile,
  deleteUser,
  login,
  addBookmark,
  deleteBookmark,
  addBooking,
  deleteBooking,
};
