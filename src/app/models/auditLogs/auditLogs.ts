import crypto from 'crypto';
import { AuditLog } from './auditLogs.model';
import { encrypt } from '../../utils/encryption.utils';

export const auditLogger = async ({
  req,
  res,
  action,
  resource,
  resourceId,
  statusCode,
  onModel,
}: {
  req: any;
  res: any;
  action: string;
  resource?: string;
  resourceId?: string[] | [];
  statusCode: number;
  onModel: string;
}) => {
  try {
    const actingUser = req.user || res.locals.createdResource;

    await AuditLog.create({
      actorId: actingUser?._id || null, // Captures 'Who'
      actorRole: actingUser?.role || 'GUEST',

      action, // Captures 'What'
      resource,
      resourceId: resourceId,
      onModel,

      endpoint: req.originalUrl,
      method: req.method,

      status: statusCode < 400 ? 'SUCCESS' : 'FAILURE',
      statusCode,

      // Compliance: Hash IP to protect privacy while maintaining auditability
      ipHash: req?.ip
        ? encrypt(req?.ip || req.connection.remoteAddress || '')
        : undefined,
      userAgent: req.headers['user-agent'],
    });
  } catch (err) {
    console.error('Audit database write failed:', err);
  }
};
