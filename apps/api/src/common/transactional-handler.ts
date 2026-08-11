import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { EntityManager, ObjectType, Repository } from 'typeorm';

export class GenericTransactionalHandler {
  constructor(protected readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>) {}

  get transaction(): EntityManager {
    return this.txHost.tx;
  }
}

export class TransactionalHandler<T> extends GenericTransactionalHandler {
  constructor(
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
    private readonly entityClass: ObjectType<T>,
  ) {
    super(txHost);
  }

  get repositoryTransactional(): Repository<T> {
    return this.transaction.getRepository(this.entityClass);
  }
}
