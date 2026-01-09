import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { UserServices } from './userRegistration.service';
import config from '../../config/config';

const createUsers = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  res.cookie('refreshToken', result?.refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration completed successfully',
    data: {
      user: result?.user,
      token: result?.accessToken,
    },
  });

  // Save ID for audit
  res.locals.createdResource = result?.user;
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Information Retrieved Successfully',
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Information Retrieved Successfully',
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

const updateUsers = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserFromDB(id, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

const getMe = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserServices.getMeFromDB(email);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Your Information Retrieved Successfully`,
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

export const userControllers = {
  createUsers,
  getSingleUser,
  getAllUsers,
  updateUsers,
  getMe,
};
