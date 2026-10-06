const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  getPortalStats
} = require('../controllers/applicationController');

router.get('/stats', getPortalStats);
router.post('/', applyForJob);
router.get('/user/:applicantId', getUserApplications);
router.get('/job/:jobId', getJobApplications);
router.put('/:id/status', updateApplicationStatus);

module.exports = router;
