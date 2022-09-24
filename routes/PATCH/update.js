const { updateData } = controllers;

module.exports = (req, res) => {
    const { id } = req.params;
    updateData(id, req.body)
        .then(data => {
            res.json({
                message: "Update data successfully",
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
