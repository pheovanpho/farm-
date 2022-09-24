module.exports = (req, res, next) => {
    if (req.body.action === "buy") {
        if (((!req.body.animalId && req.body.animalId != 0) && (!req.body.petId && req.body.petId != 0)) || !req.body.amount) {
            res.status(400).json({
                message: "Missing parameters"
            });
            return;
        } else if (req.body.amount < 0) {
            res.status(400).json({
                message: "Amount must be greater than 0"
            });
            return;
        } else if (typeof parseInt(req.body.animalId) == "number" && (req.body.animalId >= 6 || req.body.animalId < 0)) {
            res.status(400).json({
                message: "Crop id must be between 0 and 5"
            });
            return;
        } else if (typeof parseInt(req.body.petId) == "number" && (req.body.petId >= 4 || req.body.petId < 0)) {
            res.status(400).json({
                message: "Pet id must be between 0 and 3"
            });
            return;
        } else {
            next();
        }
    } else if (req.body.action === "sell") {
        if (!req.body.sellTarget) {
            res.status(400).json({
                message: "Missing parameters"
            });
            return;
        } else {
            next();
        }
    } else if (req.body.action === "steal") {
        next();
    } else {
        res.status(400).json({
            message: "Invalid action"
        });
        return;
    }
}
