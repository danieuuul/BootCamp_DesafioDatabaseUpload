import UUIDv4 from 'uuid-v4-validator';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async run({ id }: RequestDTO): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (!UUIDv4.validate(id)) {
      throw new AppError('Id in invalid format', 403);
    }

    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('This transaction does not exist.');
    }

    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
