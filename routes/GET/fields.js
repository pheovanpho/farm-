const getFields = require("../../libs/getFields");

module.exports = (req, res) => {
    const { id } = req.params;
    getFields(id)
        .then(data => {
            res.json({
                message: "Get fields successfully",
                data
            });
            return;
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
            return;
        });

}
