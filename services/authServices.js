import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

import User from "../db/models/User.js";

import HttpError from "../helpers/HttpError.js";

import sendEmail from "../helpers/sendEmail.js";

import { generateToken } from "../helpers/jwt.js";

const {APP_DOMAIN} = process.env;

const createVerifyEmail = (email, verificationCode)=> ({
    to: email,
    subject: "Verify email",
    html: `<a href="${APP_DOMAIN}/api/auth/verify/${verificationCode}" target="_blank">Click verify email</a>`
})

export const findUser = query => User.findOne({
    where: query,
})

export const signupUser = async (data) => {
    const { email, password } = data;
    const user = await User.findOne({
    where: {
        email,
    },
});

    if (user) {
    throw HttpError(409, "Email already in use");
    }

    const verificationToken = nanoid();

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...data, password: hashPassword, verificationToken});

    const verifyEmail = createVerifyEmail(email, verificationToken);

    await sendEmail(verifyEmail);

    return newUser;
};

export const verifyUser = async verificationToken => {
    const user = await findUser({verificationToken});
    if(!user) {
        throw HttpError(401, "Email not found or user already verified");
    }

    await user.update({verificationToken: null, verify: true});
}

export const resendVerifyEmail = async email => {
    const user = await findUser({email});
    if(!user) {
        throw HttpError(404, "Email not found");
    }
    if(user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = createVerifyEmail(email, user.verificationToken);

    await sendEmail(verifyEmail);
}

export const signinUser = async data => {
    const {email, password} = data;
    const user = await User.findOne({
        where: {
            email
        }
    });

    if(!user) {
        throw HttpError(401, "Email or password invalid");
    }

    if(!user.verify) {
        throw HttpError(401, "Email not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        email
    };

    const token = generateToken(payload);

    await user.update({token});


    return {
        token,
    };
}

export const logoutUser = async id => {
    const user = await findUser({id});
    if(!user || !user.token) {
        throw HttpError(404, "User not found");
    }

    await user.update({token: null});
}

export const updateAvatar = async data => {
    const { id, avatarURL } = data;
    const user = await findUser({ id });
    if (!user) {
        throw HttpError(404, "User not found");
    }

    return user.update({ avatarURL });
};