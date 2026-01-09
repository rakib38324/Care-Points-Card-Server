import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errors/appError';
import QueryBuilder from '../../builder/QueryBuilder';
import { AuditLog } from './auditLogs.model';
import { decrypt } from '../../utils/encryption.utils';
import { decryptEmployerApplicationPayload } from '../employerApplication/employerApplication.decrytor';
import { decryptMemberApplicationPayload } from '../memberApplications/memberApplications.decryptor';
import { decryptNGOApplicationPayload } from '../ngoApplication/ngoApplication.decryptor';
import { decryptSponsorPayload } from '../sponsorApplications/sponsorApplications.decryptor';

// Only models with encrypted payloads
const modelDecryptors: Record<string, (item: any) => any> = {
  EmployerApplication: decryptEmployerApplicationPayload,
  MemberApplications: decryptMemberApplicationPayload,
  NGOApplication: decryptNGOApplicationPayload,
  SponsorApplications: decryptSponsorPayload,
};

const getAllAuditLogsFromDB = async (query: Record<string, unknown>) => {
  const auditSearchableFields = ['action', 'resource', 'actorRole'];

  const auditQuery = new QueryBuilder(
    AuditLog.find().populate({
      path: 'actorId',
      select: '-password -passwordChangedAt -__v',
    }),
    query,
  )
    .search(auditSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const rawResult = await auditQuery.modelQuery.lean();
  const meta = await auditQuery.countTotal();

  const result = await Promise.all(
    rawResult.map(async (log: any) => {
      if (log.onModel && log.resourceId?.length > 0) {
        try {
          const TargetModel = mongoose.model(log.onModel);

          let resourceData = await TargetModel.find({
            _id: { $in: log.resourceId },
          })
            .select('-password -passwordChangedAt -__v')
            .lean();

          // Apply decryption if function exists for the model
          const decryptFn = modelDecryptors[log.onModel];
          if (decryptFn) {
            resourceData = resourceData.map(decryptFn);
          }

          log.resourceData = resourceData;
          delete log.resourceId;
        } catch (err) {
          // console.error(`Dynamic Population failed for model [${log.onModel}]:`, err);
          log.resourceData = [];
        }
      }

      if (log.ipHash && log.ipHash.includes(':')) {
        try {
          log.ip = decrypt(log.ipHash);
          delete log.ipHash;
        } catch (e) {
          log.ip = 'Decryption Error';
        }
      }

      return log;
    }),
  );

  return { meta, result };
};

const getSingleAuditLogFromDB = async (id: string) => {
  const result = await AuditLog.findById(id)
    .populate({
      path: 'actorId',
      select: '-password -__v',
    })
    .lean();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Audit log not found');
  }

  const logObj = result as any;

  // Dynamic population for single record
  if (logObj.onModel && logObj.resourceId?.length > 0) {
    try {
      const TargetModel = mongoose.model(logObj.onModel);

      let resourceData = await TargetModel.find({
        _id: { $in: logObj.resourceId },
      })
        .select('-password -passwordChangedAt -__v')
        .lean();

      // Apply model-specific decryption if exists
      const decryptFn = modelDecryptors[logObj.onModel];
      if (decryptFn) {
        resourceData = resourceData.map(decryptFn);
      }

      logObj.resourceData = resourceData;
      delete logObj.resourceId;
    } catch (err) {
      // console.error(`Dynamic Population failed for model [${logObj.onModel}]:`, err);
      logObj.resourceData = [];
    }
  }

  // Decrypt IP if needed
  if (logObj.ipHash?.includes(':')) {
    try {
      logObj.ip = decrypt(logObj.ipHash);
      delete logObj.ipHash;
    } catch {
      logObj.ip = 'Decryption Error';
    }
  }

  return logObj;
};

export const AuditServices = { getAllAuditLogsFromDB, getSingleAuditLogFromDB };
