import { Request, Response, NextFunction } from 'express';
import { auditLogger } from '../models/auditLogs/auditLogs';
import { USER_ROLE } from '../models/UsersRegistration/user.constent';

// ----------------- Audit Middleware -----------------
export const auditMiddleware = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  res.on('finish', async () => {
    try {
      const resourceIds = getResourceId(req, res); // <-- use helper

      await auditLogger({
        req,
        res,
        action: mapAction(req),
        resource: extractResource(req),
        resourceId: resourceIds,
        statusCode: res.statusCode,
        onModel: getModelName(req),
      });
    } catch (err) {
      console.error('Audit Middleware Error:', err);
    }
  });

  next();
};

const mapAction = (req: Request) => {
  const url = req.originalUrl;
  if (url.includes('/login')) return 'USER_LOGIN';
  if (url.includes('/user-registration')) return 'USER_REGISTER';

  const methodMap: Record<string, string> = {
    POST: 'CREATE',
    PUT: 'UPDATE',
    PATCH: 'UPDATE',
    DELETE: 'DELETE',
    GET: 'READ',
  };

  return methodMap[req.method] || 'API_ACCESS';
};

// ----------------- Helper Functions -----------------
const getResourceId = (req: Request, res?: Response): string[] => {
  // 1 Check URL param
  if (req.params?.id) return [req.params.id]; // wrap in array

  // 2 Check body for single or multiple IDs
  if (req.body) {
    if (Array.isArray(req.body)) {
      // body is array of objects
      const ids = req.body.map((item) => item._id || item.id).filter(Boolean);
      if (ids.length > 0) return ids as string[];
    } else {
      // single object
      if (req.body._id) return [req.body._id];
      if (req.body.id) return [req.body.id];
    }
  }

  // 3️ Check res.locals for created resource(s)
  if (res?.locals?.createdResource) {
    const created = res.locals.createdResource;
    if (Array.isArray(created)) {
      const ids = created.map((item) => item._id).filter(Boolean);
      if (ids.length > 0) return ids as string[];
    } else if (created._id) {
      return [created._id];
    }
  }

  // 4️ fallback
  return [];
};

const getModelName = (req: Request): string => {
  const url = req.originalUrl;
  if (url.includes(`/${USER_ROLE.admin}/`)) return 'User';
  if (url.includes(`/${USER_ROLE.superAdmin}/`)) return 'User';
  if (url.includes(`/${USER_ROLE.employer}/`)) return 'EmployerApplication';
  if (url.includes(`/${USER_ROLE.member}/`)) return 'MemberApplications';
  if (url.includes(`/${USER_ROLE.ngo}/`)) return 'NGOApplication';
  if (url.includes(`/${USER_ROLE.sponsor}/`)) return 'SponsorApplications';

  return 'User'; // Default fallback
};

const extractResource = (req: Request) => {
  const url = req.originalUrl;
  for (const role of Object.values(USER_ROLE)) {
    if (url.includes(`/${role}/`))
      return `${role.toUpperCase()}_COLLECTION_ACCESS`;
  }
};
