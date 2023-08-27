import { NextApiRequest, NextApiResponse } from 'next';
import data from '../../data.json';
import fs from 'fs';
import path from 'path';

const SECRET_TOKEN = '1234';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { acronym } = req.query;

  switch (req.method) {
    case 'GET':
  try {
    const { from = 0, limit = 10, search = '' } = req.query;

    // Filter acronyms based on search
    const filteredAcronyms = data.filter(
      item => 
        item.acronym.includes(search as string) || 
        item.definition.includes(search as string)
    );

    // Paginate the results
    const acronyms = filteredAcronyms.slice(Number(from), Number(from) + Number(limit));

    // Check if there are more results
    const hasMore = Number(from) + Number(limit) < filteredAcronyms.length;

    res.setHeader('Has-More', hasMore);
    res.status(200).json(acronyms);
  } catch (error) {
    console.error("Error processing GET request:", error);
    res.status(500).json({ error: 'Failed to fetch acronyms.' });
  }
  break;
    case 'POST':
      const newAcronym = {
        acronym: req.body.acronym,
        definition: req.body.definition
      };
      data.push(newAcronym);
      saveData(data);
      res.status(201).json(newAcronym);
      break;

    case 'PUT':
      if (req.headers.authorization !== SECRET_TOKEN) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      const index = data.findIndex(item => item.acronym === acronym);
      if (index !== -1) {
        data[index].definition = req.body.definition;
        saveData(data);
        res.status(200).json(data[index]);
      } else {
        res.status(404).json({ error: 'Acronym not found' });
      }
      break;

    case 'DELETE':
      if (req.headers.authorization !== SECRET_TOKEN) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      const updatedData = data.filter(item => item.acronym !== acronym);
      saveData(updatedData);
      res.status(200).json({ message: 'Deleted successfully' });
      break;

    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
};

const saveData = (data: any) => {
  fs.writeFileSync(path.join(process.cwd(), 'data.json'), JSON.stringify(data, null, 2));
};
