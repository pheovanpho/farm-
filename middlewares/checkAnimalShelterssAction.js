module.exports = (req, res, next) => {
    if (req.body.action === "feed") {
        if (!req.body.animalId && req.body.animalId != 0) {
            res.status(400).json({
                message: "Missing parameters"
            });
            return;
        } else if (req.body.animalId >= 5 || req.body.animalId < -1) {
            res.status(400).json({
                message: "Animal id must be between -1 and 4"
            });
            return;
        } else {
            next();
        }
    } else if (req.body.action === "collect") {
        next();
    } else {
        res.status(400).json({
            message: "Invalid action"
        });
        return;
    }
}
