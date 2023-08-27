import { Model } from 'objection';

class Acronym extends Model {
  static tableName = 'acronyms';

  id: number;
  acronym: string;
  definition: string;
}

export default Acronym;