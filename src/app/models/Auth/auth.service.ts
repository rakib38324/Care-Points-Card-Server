import httpStatus from 'http-status-codes';
import { EmailVerification, TLoginUser } from './auth.interface';
import AppError from '../../errors/appError';
import { User } from '../UsersRegistration/userRegistration.model';
import { TJwtPayload, VerifyToken, createToken } from './auth.utils';
import config from '../../config/config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utils/sendEmail';

const emailVerification = async (payload: EmailVerification) => {
  const { email, token } = payload;
  //===>check if the user is exists
  const isUserExists = await User.findOne({ email: email });

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Invalid User Information, Please create your account again.',
    );
  }

  //====> verify token
  const decoded = VerifyToken(token, config.jwt_access_secret as string);

  // console.log(decoded)
  if (decoded.email !== payload.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Invalid User Information, try again later.`,
    );
  }

  await User.findOneAndUpdate(
    {
      email: email,
    },
    {
      verified: true,
    },
  );

  return { message: 'Email Verify Successfully.' };
};

const resendEmailVerification = async (payload: { email: string }) => {
  const { email } = payload;
  //===>check if the user is exists
  const isUserExists = await User.findOne({ email: email });

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Invalid User Information, Please create your account.',
    );
  }

  if (isUserExists.status !== 'Active') {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Your profile is currently ${isUserExists?.status}. Kindly contact the administrator for support.`,
    );
  }

  if (isUserExists?.verified) {
    throw new AppError(httpStatus.NOT_FOUND, 'Your email already verified.');
  }

  const jwtPayload = {
    email,
    role: isUserExists?.role,
    _id: isUserExists?._id,
  };
  //===========> create token and sent to the client
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '20m',
  );

  const resetUILink = `${config.email_vErification_ui_link}?email=${email}&token=${resetToken}`;

  const subject = 'Verification email from Care Point Server.';

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      
      <p>Hello Dear,</p>
      <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking on the following link:</p>
       <p>
       <a href="${resetUILink}" style="color: #007bff; text-decoration: none;">Click here to verify your email</a>
       </p>
      <p>This link is valid for 20 minutes. Please do not share this code with anyone.</p>
      <p>If you did not create an account using this email address, please ignore this email.</p>
      <p>Best regards,<br />Medicine E-Commerce</p>
    </div>
  `;

  sendEmail(subject, email, html);

  return {
    message: `Successfully Resend your verification link with ${email}. Please Check Your Email.`,
  };
};

const loginUser = async (payload: TLoginUser) => {
  //===>check if the user is exists
  const isUserExists = await User.isUserExistsByEmail(payload.email);

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found! Check your Email.',
    );
  }

  if (isUserExists?.status !== 'Active') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Your profile is currently ${isUserExists?.status}. Kindly contact the administrator for support.`,
    );
  }

  ///====> checking if the password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    payload?.password,
    isUserExists?.password as string,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password!');
  }

  if (!isUserExists?.verified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not verified. Please verify your account.',
    );
  }

  //-====> access granted: send accessToken, RefreshToken
  const jwtPayload: TJwtPayload = {
    _id: isUserExists._id,
    email: isUserExists?.email,
    role: isUserExists?.role,
  };

  //===========> create token and sent to the client
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  //===========> create refresh token and sent to the client
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_access_expires_in as string,
  );

  const userInformation = await User.findOne({ email: payload.email })
    .select('-password -createdAt -updatedAt -passwordChangedAt') // Exclude password, createdAt, and updatedAt from the User document
    .exec();

  const userData = {
    _id: userInformation?._id,
    email: userInformation?.email,
    role: userInformation?.role,
    status: userInformation?.status,
  };

  return {
    user: userData,
    token: accessToken,
    refreshToken: refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  //===>check if the user is exists
  const isUserExists = await User.isUserExistsByEmail(userData.email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  const currentPassword = payload?.currentPassword;
  const hashpassword = isUserExists?.password;

  ///====> checking if the given password and exists password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    currentPassword,
    hashpassword,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password!');
  }

  // ===> hash new password
  const newHasedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
    },
    {
      password: newHasedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const forgetPassword = async (email: string) => {
  const isUserExists = await User.isUserExistsByEmail(email);

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Account found. Please check your email.',
    );
  }

  const jwtPayload = {
    _id: isUserExists?._id,
    email: isUserExists?.email,
    role: isUserExists?.role,
  };

  //===========> create token and sent to the client
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '20m',
  );

  const resetUILink = `${config.reset_password_ui_link}?email=${isUserExists.email}&token=${resetToken}`;
  const subject = 'Password Reset Link From Care Point Server.';
  const html = `
   <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color:rgb(246, 246, 246); text-align: center; padding: 20px;">
            <img src="https://res.cloudinary.com/softex-solution-podcast/image/upload/v1737364963/cmd_logo_m1lybt.png" alt="CMD Healthcare Services" style="max-width: 150px;">
        </div>
        <!-- Body -->
        <div style="padding: 20px; color: #333333;">
            <h1 style="font-size: 20px; margin-bottom: 15px;">Hello Dear,</h1>
            <p style="line-height: 1.6; margin-bottom: 20px;">We received a request to reset your password. To proceed, please click the button below:</p>
            <p style="text-align: center; margin-bottom: 20px;">
                <a href="${resetUILink}"  style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #3a2e5c; border-radius: 5px; text-decoration: none;">Reset Passowrd</a>
            </p>
            <p style="line-height: 1.6;">If you did not request a password reset, please ignore this email. Your account will remain secure.</p>
            <p style="margin-top: 20px;">Best regards,<br>The CMD Health Team.</p>
        </div>
        <!-- Footer -->
        <div style="text-align: center; background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #888888;">
            <p style="margin: 0;">CMD Healthcare Services</p>
            <p style="margin: 10px 0;">
                <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Privacy Policy</a> | 
                <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Terms of Service</a> | 
                <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Help Center</a>
            </p>
        </div>
    </div>
</body>
  `;

  sendEmail(subject, isUserExists.email, html);

  return `Reset link sent your email: ${isUserExists.email}`;
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const isUserExists = await User.isUserExistsByEmail(payload.email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  //====> verify token
  const decoded = VerifyToken(token, config.jwt_access_secret as string);

  // console.log(decoded)
  if (decoded.email !== payload.email) {
    throw new AppError(httpStatus.FORBIDDEN, `You are forbidden!!`);
  }

  ///===> hash new password
  const newHasedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: newHasedPassword,
      passwordChangedAt: new Date(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return 'Your Password Changed Successfully';
};

const getMeFromDB = async (email: string) => {
  // const result = await User.aggregate([
  //   {
  //     $match: { email: email },
  //   },
  //   {
  //     $project: {
  //       password: 0,
  //       passwordChangedAt: 0,
  //       __v: 0,
  //     },
  //   },
  // ]);
  // if (result?.length > 0) {
  //   return result[0];
  // } else {
  //   throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  // }

  const result = await User.findOne({ email: email })
    .select('-password -passwordChangedAt -__v')
    .populate('subscribetionId');

  if (result) {
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }
};

export const AuthServices = {
  emailVerification,
  resendEmailVerification,
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
  getMeFromDB,
};
