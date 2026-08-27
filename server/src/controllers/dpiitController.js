const DpiitMockRegistry = require('../models/dpiitMockRegistryModel');
const Startup = require('../models/startupModel');

async function verifyDpiit(req, res) {
  try {
    const { regNumber } = req.body;
    if (!regNumber) {
      return res.status(400).json({ success: false, message: 'Registration number required' });
    }

    const entry = await DpiitMockRegistry.findByRegNumber(regNumber);
    if (!entry) {
      return res.status(404).json({ success: false, verified: false, message: 'DPIIT registration not found' });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      company_name: entry.company_name,
      sector: entry.sector,
      incorporation_date: entry.incorporation_date,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
}

async function confirmDpiitVerification(req, res) {
  try {
    const { regNumber } = req.body;
    const userId = req.user.user_id;

    const entry = await DpiitMockRegistry.findByRegNumber(regNumber);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Invalid DPIIT registration' });
    }

    const updatedStartup = await Startup.updateDpiitVerification(userId, {
      dpiit_reg_number: regNumber,
      company_name: entry.company_name,
      sector: entry.sector,
    });

    if (!updatedStartup) {
      return res.status(404).json({ success: false, message: 'Startup profile not found' });
    }

    return res.status(200).json({ success: true, startup: updatedStartup });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Confirmation failed' });
  }
}

module.exports = { verifyDpiit, confirmDpiitVerification };