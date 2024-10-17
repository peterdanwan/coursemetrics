// database/seedDB/seedProfessors.ts

import Professor from '../models/Professor';

const seedProfessors = async () => {
  await Professor.bulkCreate([
    {
      first_name: 'Alice',
      last_name: 'Johnson',
    },
    {
      first_name: 'David',
      last_name: 'Humphrey',
    },
    {
      first_name: 'Vlad',
      last_name: 'Olshansky',
    },
    {
      first_name: 'Fardad',
      last_name: 'Soleimanloo',
    },
    {
      first_name: 'Savita',
      last_name: 'Sehrawat',
    },
  ]);
};

export { seedProfessors };
