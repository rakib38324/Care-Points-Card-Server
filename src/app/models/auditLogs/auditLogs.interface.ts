// auditLog.interface.ts
export type TAuditLog = {
  actorId?: string; // User ID
  actorRole?: string;

  action: string;

  resource?: string; // employerApplication, memberApplication
  resourceId?: [string];
  onModel?: string;

  method: string; // GET, POST, PUT
  endpoint: string; // /api/v1/employer/apply

  status: 'SUCCESS' | 'FAILURE';
  statusCode: number;

  ipHash?: string; // hashed IP (privacy-safe)
  userAgent?: string;

  createdAt: Date;
};
