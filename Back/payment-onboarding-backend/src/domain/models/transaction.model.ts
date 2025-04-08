// src/domain/models/transaction.model.ts

export class Transaction {
    constructor(
      public readonly id: string,
      public readonly amountInCents: number,
      public readonly currency: string,
      public readonly customerEmail: string,
      public readonly reference: string,
      public readonly paymentMethodType: string,
      public readonly status: string,
      public readonly createdAt: Date,
    ) {}
  }