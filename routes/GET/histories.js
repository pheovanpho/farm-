const { getData } = controllers;

module.exports = (req, res) => {
    const { id } = req.params;
    getData(id)
        .then(data => {
            const { money, steal, defend } = data;
            res.json({
                message: "Get data successfully",
                data: {
                    money,
                    steal,
                    defend
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
            return;
        })
}
