const { getData } = controllers;

module.exports = (req, res) => {
    const { id } = req.params;
    getData(id)
        .then(data => {
            res.json({
                message: "Get data successfully",
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
