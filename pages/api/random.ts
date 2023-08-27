import { NextApiRequest, NextApiResponse } from 'next';
import data from '../../data.json';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { count = 1 } = req.query;

  const shuffled = data.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Number(count));

  res.status(200).json(selected);
};
