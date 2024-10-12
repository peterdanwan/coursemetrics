// database/seedDB/seedProfessors.ts
import Professor from '../models/Professor.js';

const seedProfessors = async () => {
  await Professor.bulkCreate([
    {
      firstName: 'Alice',
      lastName: 'Johnson',
    },
  ]);
};

export { seedProfessors };
