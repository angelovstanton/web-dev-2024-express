import express, { Request, Response } from 'express';
import { db } from '../database';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, universityId, subjects } = req.body;
    const university = await db.models.University.findByPk(universityId); 

    if (!university) {
      res.status(404).json({ error: 'University not found' });
      return;
    }

    if (await db.models.User.findOne({ where: { email } })) {
      throw new Error("User already exists.")
    }
    
    const user = await db.models.User.create({ name, email, universityId });

    if (subjects && subjects.length > 0) {
      const subjectInstances = await db.models.Subject.findAll({
        where: { id: subjects },
      });

      if (subjectInstances.length !== subjects.length) {
        res.status(400).json({ message: 'Some subjects do not exist' });
      }

      await user.addSubjects(subjectInstances);
    }

    const createdUser = await db.models.User.findByPk(user.id, {
      include: { model: db.models.Subject, as: 'subjects' },
    });

    res.status(201).json(createdUser);

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/subjects', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { subjects } = req.body;

    const user = await db.models.User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    const subjectInstances = await db.models.Subject.findAll({
      where: { id: subjects },
    });

    if (subjectInstances.length !== subjects.length) {
      res.status(400).json({ message: 'Some subjects do not exist' });
    }

    await user?.setSubjects(subjectInstances);

    // Fetch updated user with associated subjects
    const updatedUser = await db.models.User.findByPk(userId, {
      include: { model: db.models.Subject, as: 'subjects' },
    });

    res.json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await db.models.User.findAll({
      include: {
        model: db.models.University,
        as: 'university',
      },
    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
