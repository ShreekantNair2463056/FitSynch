const mongoose = require('mongoose');
require('dotenv').config();
const MembershipPlan = require('./models/MembershipPlan');

const plans = [
  {
    name: 'Gold',
    price: 2300,
    durationMonths: 1,
    features: ['Access to Gym', 'Dietician']
  },
  {
    name: 'Platinum',
    price: 3300,
    durationMonths: 1,
    features: ['Access to Gym', 'Dietician', 'Personal Trainer', 'Reserve VIP areas for crowd free workout']
  },
  {
    name: 'Diamond',
    price: 4300,
    durationMonths: 1,
    features: ['Access to Gym', 'Dietician', 'Personal Trainer', 'Sauna', 'Gym Chef', 'VIP Rooms']
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    
    // Clear existing plans if you want, or just insert.
    // I'll clear existing plans so it's clean.
    await MembershipPlan.deleteMany({});
    
    await MembershipPlan.insertMany(plans);
    console.log('Successfully seeded plans');
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
