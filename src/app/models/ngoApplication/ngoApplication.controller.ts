import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { ngoApplicationServices } from './ngoApplication.service';

/**
 * Handle creation of a new NGO application
 */
const createNGOApplication = catchAsync(async (req, res) => {
  const result = await ngoApplicationServices.createNGOApplicationIntoDB(
    req.user,
    req.body,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'NGO Application submitted successfully.',
    data: result,
  });
});

/**
 * Retrieve the single application belonging to the logged-in user
 */
const getSingleNGOApplication = catchAsync(async (req, res) => {
  const result = await ngoApplicationServices.getSingleNGOApplicationFromDB(
    req.user,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'NGO Application retrieved successfully.',
    data: result,
  });
});

/**
 * Retrieve all NGO applications (Admin/SuperAdmin only)
 */
const getAllNGOApplications = catchAsync(async (req, res) => {
  const result = await ngoApplicationServices.getAllNGOApplicationsFromDB(
    req.user,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All NGO Applications retrieved successfully.',
    data: result,
  });
});

/**
 * Update specific fields of an NGO application
 */
const updateNGOApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ngoApplicationServices.updateNGOApplicationInDB(
    req.user,
    id,
    req.body,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'NGO Application updated successfully.',
    data: result,
  });
});

/**
 * Soft delete an NGO application
 */
const deleteNGOApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ngoApplicationServices.deleteNGOApplicationFromDB(
    req.user,
    id,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'NGO Application deleted successfully.',
    data: result,
  });
});

/**
 * Retrieve NGO applications with email (Admin/SuperAdmin only)
 */
const getNGOApplicationsWithEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result =
    await ngoApplicationServices.getNGOApplicationWithEmailFromDB(email);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'NGO Applications retrieved successfully.',
    data: result,
  });
});

export const ngoApplicationControllers = {
  createNGOApplication,
  getSingleNGOApplication,
  getAllNGOApplications,
  updateNGOApplication,
  deleteNGOApplication,
  getNGOApplicationsWithEmail,
};
