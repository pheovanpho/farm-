const { getAll } = controllers;

module.exports = (req, res) => {
    getAll()
        .then(data => {
        	data = data.map(e => {
        		const minified = { id: e.id, name: e.data.name, level: e.data.level };
        		return minified;
        	});
        	data.sort((a, b) => a.level == b.level ? a.name.localeCompare(b.name) : (b.level - a.level));
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
