export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  const cookieName = user.role === "Admin" ? "CoachToken" : "UserToken";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      httpOnly: true,
      secure: false, // ✅ false for localhost; true for production
      sameSite: "Lax", // ✅ allows frontend/backend on different ports
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
