const Label = require('../../models/label');

const checkLabelOwnership = async (req, res, next) => {
  const labelId = req.params.labelId;
  const userId = req.user.id;

  try {
    // Find the label by ID
    const label = await Label.findById(labelId);

    if (!label) {
      return res.status(404).json({ message: 'Label not found' });
    }

    // Check if the label belongs to the current user
    if (label.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }

    next(); // Ownership confirmed, proceed to the next middleware or route handler
  } catch (err) {
    console.error('Error checking label ownership:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {checkLabelOwnership};
