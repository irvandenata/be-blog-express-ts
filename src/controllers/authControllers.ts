import { NextFunction, RequestHandler, response } from "express";
import catchAsync from "../utils/catchAsync";
import AuthService from "../services/authService";
import { CLIENT_URL } from "../config";
import { responseFormatter } from "../utils/helpers";

const authService = new AuthService();

export const register: RequestHandler = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    const data = await authService.registerUser(
        firstName,
        lastName,
        email,
        password,
        passwordConfirm
    );
    res.status(201).send(responseFormatter("success", data, "single"));
});

export const verify: RequestHandler = catchAsync(async (req, res, next) => {
    const { sessionCookie, sessionExpiry } =
        await authService.verifyUserAndCreateSession(req.params.token);
    res.cookie(process.env.COOKIE_NAME as string, sessionCookie, {
        expires: sessionExpiry,
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
    });
    res.redirect(`${CLIENT_URL}`);
});

export const login: RequestHandler = catchAsync(async (req, res, next) => {
    const { sessionCookie, sessionExpiry } =
        await authService.loginUserAndCreateSession(req.body);
    // assign the cookie to the response
    res.cookie(process.env.COOKIE_NAME as string, sessionCookie, {
        expires: sessionExpiry,
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
    });
    // send a success message to the client
    res.status(200).send({ status: "success", message: "Login successful" });
});

export const checkAuth: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await authService.checkUserSession(
        req.cookies[process.env.COOKIE_NAME as string]
    );
    return res.status(200).send(responseFormatter("success", data, "single"));
});

export const logout: RequestHandler = (req, res, next) => {
    res.clearCookie(process.env.COOKIE_NAME as string);
    res.status(200).json({ status: "success", message: "Logout successful" });
};

export const sendForgotPasswordMail: RequestHandler = catchAsync(
    async (req, res, next) => {
        await authService.sendForgotPasswordMail(req.body.email);
        res.status(200).send({
            status: "success",
            message: "Password reset email sent",
        });
    }
);

export const forgotPassword: RequestHandler = catchAsync(
    async (req: any, res: any, next: NextFunction) => {
        await authService.changePassword(req.body);
        res.status(200).send({
            status: "success",
            message: "Password changed successfully",
        });
    }
);
