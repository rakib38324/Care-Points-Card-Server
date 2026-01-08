import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import httpStatus from 'http-status-codes';
import { memberServices } from './memberApplications.service';

const createMembersApplication = catchAsync(async (req, res) => {
  const result = await memberServices.createMemberIntoDB(req.user, req.body);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member Application Send Successfully.',
    data: result,
  });
});

const getSingleMemberApplication = catchAsync(async (req, res) => {
  const result = await memberServices.getSingleMemberApplicationFromDB(
    req.user,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member Application Retrieved Successfully.',
    data: result,
  });
});

const getAllMemberApplication = catchAsync(async (req, res) => {
  const result = await memberServices.getAllMemberApplicationFromDB(req.user);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member Application Retrieved Successfully.',
    data: result,
  });
});

const updateMemberApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await memberServices.updateMemberApplicationFromDB(
    req.user,
    id,
    req.body,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member Application Retrieved Successfully.',
    data: result,
  });
});

const deleteMemberApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await memberServices.deleteMemberApplicationFromDB(
    req.user,
    id,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member Application Delete Successfully.',
    data: result,
  });
});

const getMemberApplicationsWithEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result =
    await memberServices.getMemberApplicationWithEmailFromDB(email);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member Application Retrieved Successfully.',
    data: result,
  });
});

export const memberControllers = {
  createMembersApplication,
  getAllMemberApplication,
  getSingleMemberApplication,
  deleteMemberApplication,
  getMemberApplicationsWithEmail,
  updateMemberApplication,
};
