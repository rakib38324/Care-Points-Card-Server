"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendEmail_1 = require("../../utils/sendEmail");
const emailVerification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, token } = payload;
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ email: email });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Invalid User Information, Please create your account again.');
    }
    //====> verify token
    const decoded = (0, auth_utils_1.VerifyToken)(token, config_1.default.jwt_access_secret);
    // console.log(decoded)
    if (decoded.email !== payload.email) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, `Invalid User Information, try again later.`);
    }
    yield userRegistration_model_1.User.findOneAndUpdate({
        email: email,
    }, {
        verified: true,
    });
    return { message: 'Email Verify Successfully.' };
});
const resendEmailVerification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ email: email });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Invalid User Information, Please create your account.');
    }
    if (isUserExists.status !== 'Active') {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, `Your profile is currently ${isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.status}. Kindly contact the administrator for support.`);
    }
    if (isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.verified) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Your email already verified.');
    }
    const jwtPayload = {
        email,
        role: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role,
        _id: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists._id,
    };
    //===========> create token and sent to the client
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '20m');
    const resetUILink = `${config_1.default.email_vErification_ui_link}?email=${email}&token=${resetToken}`;
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
    (0, sendEmail_1.sendEmail)(subject, email, html);
    return {
        message: `Successfully Resend your verification link with ${email}. Please Check Your Email.`,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.isUserExistsByEmail(payload.email);
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found! Check your Email.');
    }
    if ((isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.status) !== 'Active') {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, `Your profile is currently ${isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.status}. Kindly contact the administrator for support.`);
    }
    ///====> checking if the password is correct
    const isPasswordMatch = yield userRegistration_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password);
    if (!isPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Incorrect password!');
    }
    if (!(isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.verified)) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not verified. Please verify your account.');
    }
    //-====> access granted: send accessToken, RefreshToken
    const jwtPayload = {
        _id: isUserExists._id,
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
        role: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role,
    };
    //===========> create token and sent to the client
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //===========> create refresh token and sent to the client
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_access_expires_in);
    const userInformation = yield userRegistration_model_1.User.findOne({ email: payload.email })
        .select('-password -createdAt -updatedAt -passwordChangedAt') // Exclude password, createdAt, and updatedAt from the User document
        .exec();
    const userData = {
        _id: userInformation === null || userInformation === void 0 ? void 0 : userInformation._id,
        email: userInformation === null || userInformation === void 0 ? void 0 : userInformation.email,
        role: userInformation === null || userInformation === void 0 ? void 0 : userInformation.role,
        status: userInformation === null || userInformation === void 0 ? void 0 : userInformation.status,
    };
    return {
        user: userData,
        token: accessToken,
        refreshToken: refreshToken,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.isUserExistsByEmail(userData.email);
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'This user not found!');
    }
    const currentPassword = payload === null || payload === void 0 ? void 0 : payload.currentPassword;
    const hashpassword = isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password;
    ///====> checking if the given password and exists password is correct
    const isPasswordMatch = yield userRegistration_model_1.User.isPasswordMatched(currentPassword, hashpassword);
    if (!isPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Incorrect password!');
    }
    // ===> hash new password
    const newHasedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield userRegistration_model_1.User.findOneAndUpdate({
        email: userData.email,
    }, {
        password: newHasedPassword,
        passwordChangedAt: new Date(),
    });
    return null;
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield userRegistration_model_1.User.isUserExistsByEmail(email);
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'No Account found. Please check your email.');
    }
    const jwtPayload = {
        _id: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists._id,
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
        role: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role,
    };
    //===========> create token and sent to the client
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '20m');
    const resetUILink = `${config_1.default.reset_password_ui_link}?email=${isUserExists.email}&token=${resetToken}`;
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
    (0, sendEmail_1.sendEmail)(subject, isUserExists.email, html);
    return `Reset link sent your email: ${isUserExists.email}`;
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield userRegistration_model_1.User.isUserExistsByEmail(payload.email);
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'This user not found!');
    }
    //====> verify token
    const decoded = (0, auth_utils_1.VerifyToken)(token, config_1.default.jwt_access_secret);
    // console.log(decoded)
    if (decoded.email !== payload.email) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, `You are forbidden!!`);
    }
    ///===> hash new password
    const newHasedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield userRegistration_model_1.User.findOneAndUpdate({
        email: decoded.email,
    }, {
        password: newHasedPassword,
        passwordChangedAt: new Date(),
    }, {
        new: true,
        runValidators: true,
    });
    return 'Your Password Changed Successfully';
});
const getMeFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield userRegistration_model_1.User.findOne({ email: email })
        .select('-password -passwordChangedAt -__v')
        .populate('subscribetionId');
    if (result) {
        return result;
    }
    else {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'This user not found!');
    }
});
exports.AuthServices = {
    emailVerification,
    resendEmailVerification,
    loginUser,
    changePassword,
    forgetPassword,
    resetPassword,
    getMeFromDB,
};
