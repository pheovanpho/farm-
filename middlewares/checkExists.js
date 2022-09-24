const { getData } = controllers;

module.exports = (req, res, next) => {
    const id = req.params.id || req.body.id;
    if (id || id === 0) {
        getData(id)
            .then(data => {
                const checkPath = req.path.replace(/^\//, "") === "create";
                if (data && checkPath) {
                    res.status(409).json({
                        message: "Id already exist"
                    })
                    return;
                } else if (!data && !checkPath) {
                    res.status(404).json({
                        message: "Id not found"
                    })
                    return;
                } else next();
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                });
                return;
            });
    } else {
        res.status(400).json({
            message: "Bad request"
        });
    }
}
