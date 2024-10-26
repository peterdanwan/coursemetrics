// database/seedDB/seedCourseDeliveryFormats.ts

import CourseDeliveryFormat from '../models/CourseDeliveryFormat';

const seedCourseDeliveryFormats = async () => {
  await CourseDeliveryFormat.bulkCreate([
    {
      format: 'Online Async',
      description:
        'Students learn remotely and are not required to come to campus. No scheduled class time and learning is independent.',
    },
    {
      format: 'Online Sync',
      description:
        'Students learn remotely and are not required to come to campus. Scheduled online time with professors.',
    },
    {
      format: 'In-person',
      description:
        'Programs or courses are fully in person and require students to come to campus.',
    },
    {
      format: 'Flexible',
      description:
        'Using innovative learning spaces, professors teach a class to students in a classroom or lab and broadcast to students online at the same time. In courses delivered in the flexible format, students have a choice of coming to campus for an on-campus experience or learning remotely online. Programs that indicate flexible delivery will include at least one course in this format.',
    },
    {
      format: 'Hybrid',
      description:
        'Some parts of the program or course are online and other parts are in person. Students will need to come to campus for part of their program or course.',
    },
  ]);
};

export { seedCourseDeliveryFormats };
