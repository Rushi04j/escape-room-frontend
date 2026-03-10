const { v4: uuidv4 } = require('uuid');

const generateGuestId = () => {
    return `guest_${uuidv4()}`; // Example: guest_123e4567-e89b-12d3-a456-426614174000
};

module.exports = generateGuestId;