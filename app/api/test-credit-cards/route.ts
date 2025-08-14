import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { creditCards } from '@/lib/db/schema';

export async function GET() {
  try {
    console.log('🔍 Fetching credit cards from database...');
    const cards = await db.select().from(creditCards);
    console.log(`✅ Found ${cards.length} credit cards`);
    return NextResponse.json({ success: true, data: cards });
  } catch (error) {
    console.error('❌ Error fetching credit cards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch credit cards' },
      { status: 500 }
    );
  }
}
