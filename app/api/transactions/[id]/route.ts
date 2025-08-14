import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id;

    // Buscar a transação antes de deletar para reverter o saldo
    const transaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, transactionId))
      .limit(1);

    if (transaction.length === 0) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    const transactionData = transaction[0];

    // Reverter o saldo da conta de origem
    if (transactionData.accountId) {
      const account = await db
        .select()
        .from(accounts)
        .where(eq(accounts.id, transactionData.accountId))
        .limit(1);

      if (account.length > 0) {
        const valorReverso = transactionData.type === 'receita' 
          ? -transactionData.amount 
          : transactionData.amount;

        await db
          .update(accounts)
          .set({
            balance: account[0].balance + valorReverso,
            updatedAt: new Date(),
          })
          .where(eq(accounts.id, transactionData.accountId));
      }
    }

    // Se for transferência, reverter também a conta de destino
    if (transactionData.type === 'transferencia' && transactionData.toAccountId) {
      const toAccount = await db
        .select()
        .from(accounts)
        .where(eq(accounts.id, transactionData.toAccountId))
        .limit(1);

      if (toAccount.length > 0) {
        await db
          .update(accounts)
          .set({
            balance: toAccount[0].balance - transactionData.amount,
            updatedAt: new Date(),
          })
          .where(eq(accounts.id, transactionData.toAccountId));
      }
    }

    // Deletar a transação
    await db
      .delete(transactions)
      .where(eq(transactions.id, transactionId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
