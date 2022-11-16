const router = require("express").Router();

const {
  refrescarAccessToken,
  borrarRefreshToken,
} = require("../controller/tokens");

router.get(
  "/refrescarAccessToken",

  refrescarAccessToken
);
router.get("/borrarRefreshToken", borrarRefreshToken);

module.exports = router;
