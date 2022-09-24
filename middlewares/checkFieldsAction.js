module.exports = (req, res, next) => {
    if (req.body.action === "plant") {
        if ((!req.body.cropId && req.body.cropId != 0) || !req.body.amount) {
            res.status(400).json({
                message: "Missing parameters"
            });
            return;
        } else if (req.body.amount < 0) {
            res.status(400).json({
                message: "Amount must be greater than 0"
            });
            return;
        } else if (req.body.cropId >= 16 || req.body.cropId < 0) {
            res.status(400).json({
                message: "Crop id must be between 0 and 15"
            });
            return;
        } else {
            next();
        }
    } else if (req.body.action === "harvest") {
        next();
    } else {
        res.status(400).json({
            message: "Invalid action"
        });
        return;
    }
}
