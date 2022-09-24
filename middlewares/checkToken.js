require("dotenv").config();

module.exports = (req, res, next) => {
    const { token } = req.headers;
    if (token === process.env.TOKEN) {
        next();
    } else {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
}
