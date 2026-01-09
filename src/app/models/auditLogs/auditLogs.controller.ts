import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { AuditServices } from './auditLogs.service';

const getAllAudits = catchAsync(async (req, res) => {
  // Pass req.query to the service for QueryBuilder processing
  const result = await AuditServices.getAllAuditLogsFromDB(req.query);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Audit logs retrieved successfully',
    meta: result.meta, // Includes pagination info: page, limit, total, totalPage
    data: result.result,
  });

  // Note: We usually don't audit the "Audit Log" access itself
  // to prevent infinite loops, but you can if needed:
  res.locals.createdResource = result.result;
});

const getSingleAudit = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AuditServices.getSingleAuditLogFromDB(id);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Audit log fetched successfully',
    data: result,
  });

  res.locals.createdResource = result;
});

export const AuditControllers = {
  getAllAudits,
  getSingleAudit,
};
