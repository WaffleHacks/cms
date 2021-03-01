const EDITOR_ROLE_NAME = "Editor";

function error(response, message) {
  response.status = 400;
  return {success: false, reason: message};
}

module.exports = {
  async register(ctx) {
    // Ensure the token is valid
    if (ctx.request.query.token !== process.env.REGISTRATION_TOKEN)
      return error(ctx.response, "invalid registration token");

    // Extract request data
    const {
      first_name,
      last_name,
      email,
    } = ctx.request.body;

    // Ensure everything is present
    if (first_name === undefined || first_name === ""
      || last_name === undefined || last_name === ""
      || email === undefined || email === "")
      return error(ctx.response, "missing at least one of: 'first_name', 'last_name', and 'email'");

    // Check that the email is not already taken
    const emailCheck = await strapi.query("user", "admin").find({ email });
    if (emailCheck.length !== 0)
      return error(ctx.response, "email already in use");

    // Find the editor role
    const editor = await strapi.query("role", "admin").findOne({name: EDITOR_ROLE_NAME});
    if (editor === null) return error(ctx.response, "failed to find role");

    // Create the user
    const created = await strapi.admin.services.user.create({
      email,
      firstname: first_name,
      lastname: last_name,
      roles: [editor.id]
    });

    return {"success": true, "token": created.registrationToken};
  },
}
