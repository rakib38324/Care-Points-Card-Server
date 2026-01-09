import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { employerApplicationServices } from './employerApplication.service';

/**
 * ================= Create Employer Application =================
 */
const createEmployerApplication = catchAsync(async (req, res) => {
  const result = await employerApplicationServices.createEmployerIntoDB(
    req.user,
    req.body,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employer Group Sponsorship Application Sent Successfully.',
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

/**
 * ================= Get Single Employer Application =================
 */
const getSingleEmployerApplication = catchAsync(async (req, res) => {
  const result =
    await employerApplicationServices.getSingleEmployerApplicationFromDB(
      req.user,
    );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employer Application Retrieved Successfully.',
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

/**
 * ================= Get All Employer Applications =================
 */
const getAllEmployerApplications = catchAsync(async (req, res) => {
  const result =
    await employerApplicationServices.getAllEmployerApplicationFromDB(req.user);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Employer Applications Retrieved Successfully.',
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

/**
 * ================= Update Employer Application =================
 */
const updateEmployerApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await employerApplicationServices.updateEmployerApplicationFromDB(
      req.user,
      id,
      req.body,
    );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employer Application Updated Successfully.',
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

/**
 * ================= Delete Employer Application =================
 */
const deleteEmployerApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await employerApplicationServices.deleteEmployerApplicationFromDB(
      req.user,
      id,
    );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employer Application Deleted Successfully.',
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

/**
 * ================= Get Employer Applications By Email =================
 */
const getEmployerApplicationsWithEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result =
    await employerApplicationServices.getEmployerApplicationWithEmailFromDB(
      email,
    );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employer Applications Retrieved Successfully.',
    data: result,
  });

  // Save ID for audit
  res.locals.createdResource = result;
});

export const employerApplicationControllers = {
  createEmployerApplication,
  getAllEmployerApplications,
  getSingleEmployerApplication,
  deleteEmployerApplication,
  getEmployerApplicationsWithEmail,
  updateEmployerApplication,
};
