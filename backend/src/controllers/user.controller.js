const Mailer = require("../utils/mailer");
const { CONTACT_MAIL_ADDRESS } = require("../utils/secrets");

exports.contact = async (req, res) => {
  const { fromName, fromEmail, subject, description } = req.body;
  const data = {
    from: fromEmail,
    to: CONTACT_MAIL_ADDRESS || "info@articulateit.co.za",
    subject,
    text: description,
  };
  console.log(data);
  const result = await Mailer.send(data);
  res.send(result);
};
