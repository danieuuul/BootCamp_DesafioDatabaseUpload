import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

interface RequestDTO {
  fileName: string;
}

class ImportTransactionsService {
  async run({ fileName }: RequestDTO): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.directory, fileName);

    const csvJson = await csv().fromFile(filePath);

    await fs.promises.unlink(filePath);

    const createTransactionService = new CreateTransactionService();
    const transactions: Transaction[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of csvJson) {
      const { title, type, value, category } = item;

      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransactionService.run({
        title,
        type,
        value: Number.parseFloat(value),
        category,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
