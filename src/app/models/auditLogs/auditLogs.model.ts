import { Schema, model } from 'mongoose';
import { TAuditLog } from './auditLogs.interface';

const auditLogSchema = new Schema<TAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    actorRole: { type: String },

    action: { type: String, required: true },
    resource: { type: String },
    // resourceId: { type: [Schema.Types.ObjectId], default: undefined },

    // The magic happens here
    resourceId: [
      {
        type: Schema.Types.ObjectId,
        refPath: 'onModel',
      },
    ],

    onModel: {
      type: String,
      // required: true,
      // enum: ['User', 'EmployerApplication', 'MemberApplications', 'NGOApplication', 'SponsorApplications','Payment']
    },

    method: { type: String, required: true },
    endpoint: { type: String, required: true },

    status: { type: String, enum: ['SUCCESS', 'FAILURE'], required: true },
    statusCode: { type: Number, required: true },

    ipHash: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const AuditLog = model<TAuditLog>('AuditLog', auditLogSchema);
