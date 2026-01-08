import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import httpStatus from 'http-status-codes';
import { SponsorApplicationServices } from './sponsorApplications.service';

const createSpondorApplication = catchAsync(async (req, res) => {
  const result = await SponsorApplicationServices.createSponsorIntoDB(
    req.user,
    req.body,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sponsor Application Send Successfully.',
    data: result,
  });
});

const getSingleSposorApplication = catchAsync(async (req, res) => {
  const result =
    await SponsorApplicationServices.getSingleSponsorApplicationFromDB(
      req.user,
    );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sponsor Application Retrieved Successfully.',
    data: result,
  });
});

const getAllSponsorApplication = catchAsync(async (req, res) => {
  const result =
    await SponsorApplicationServices.getAllSponsorApplicationsFromDB(req.user);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sponsor Application Retrieved Successfully.',
    data: result,
  });
});

const updateSponsorApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SponsorApplicationServices.updateSponsorApplicationFromDB(
      req.user,
      id,
      req.body,
    );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Spondor Application Retrieved Successfully.',
    data: result,
  });
});

const deleteSponsorApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SponsorApplicationServices.deleteSponsorApplicationFromDB(
      req.user,
      id,
    );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Spondor Application Delete Successfully.',
    data: result,
  });
});

const getSponsorApplicationsWithEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result =
    await SponsorApplicationServices.getSponsorApplicationWithEmailFromDB(
      email,
    );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Spondor Application Retrieved Successfully.',
    data: result,
  });
});

export const SpondorControllers = {
  createSpondorApplication,
  getAllSponsorApplication,
  getSingleSposorApplication,
  getSponsorApplicationsWithEmail,
  updateSponsorApplication,
  deleteSponsorApplication,
};
