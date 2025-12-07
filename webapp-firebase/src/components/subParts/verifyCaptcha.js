const functions = require("firebase-functions/v2/https");
const axios = require("axios");

exports.verifyCaptcha = functions.onRequest(async (req, res) => {
  const token = req.body.token;
  const secret = process.env.RECAPTCHA_SECRET;

  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  );

  if (response.data.success && response.data.score > 0.5) {
    return res.json({ success: true });
  }

  return res.json({ success: false });
});
