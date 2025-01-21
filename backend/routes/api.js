const express = require("express");
const router = express.Router();

router.get("/v1/reservation/rsvMeddeptList", (req, res) => {
  const { his_hsp_tp_cd } = req.query;
  if (!his_hsp_tp_cd) res.json({ ok: false });
  else if (his_hsp_tp_cd === "01") res.json({ ok: true, data: [{ cdcode: "EY", cdvalue: "서울 안과" }] });
  else if (his_hsp_tp_cd === "02") res.json({ ok: true, data: [{ cdcode: "FM", cdvalue: "목동 가정의학과" }] });
  else res.status(404).end();
});

router.get("/v1/reservation/medDocList", (req, res) => {
  const { his_hsp_tp_cd, dept_cd } = req.query;
  if (his_hsp_tp_cd && dept_cd) {
    res.json({
      ok: true,
      data: [
        { DR_NM: "성동욱", MED_DEPT_CD: dept_cd },
        { DR_NM: "홍수아", MED_DEPT_CD: dept_cd },
      ],
    });
  } else res.status(404).end();
});

router.get("/v1/reservation/medSchdList", (req, res) => {
  const { his_hsp_tp_cd, dept_cd, med_ym } = req.query;
   res.status(404).end();
});

router.get("/v1/*", (req, res) => {
  console.log("GET body", req.query);
  res.status(404).end();
});

router.post("/v1/*", (req, res) => {
  console.log("POST body", req.body);
  res.end();
});

module.exports = router;
