const router = require("express").Router();

const checkExists = require("../middlewares/checkExists");
const checkFieldsAction = require("../middlewares/checkFieldsAction");
const checkAnimalShelterssAction = require("../middlewares/checkAnimalShelterssAction");
const checkOthersAction = require("../middlewares/checkOthersAction");


// GET
router.get("/", require("./GET/index"));
router.get("/info/:id", checkExists, require("./GET/info"));
router.get("/crops/:id", checkExists, require("./GET/crops"));
router.get("/fields/:id", checkExists, require("./GET/fields"));
router.get("/animals/:id", checkExists, require("./GET/animals"));
router.get("/animalShelters/:id", checkExists, require("./GET/animalShelters"));
router.get("/shop/:id", checkExists, require("./GET/shop"));
router.get("/histories/:id", checkExists, require("./GET/histories"));

router.get("/top", require("./GET/top"));

// POST - CREATE NEW ACCOUNT
router.post("/create", checkExists, require("./POST/create"));

// PUT
router.put("/fields/:id", checkExists, checkFieldsAction, require("./PUT/fields"));
router.put("/animalShelters/:id", checkExists, checkAnimalShelterssAction, require("./PUT/animalShelters"));
router.put("/others/:id", checkExists, checkOthersAction, require("./PUT/others"));

// PATCH - DEV ONLY
router.patch("/update/:id", checkExists, require("./PATCH/update"));


module.exports = router;
