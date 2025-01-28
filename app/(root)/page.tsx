import BookList from '@/components/BookList';
import BookOverview from '@/components/BookOverview';

import { sampleBooks } from '@/constants';
import { db } from '@/database/drizzle';
import { usersTable } from '@/database/schema';
import { log } from 'console';

export default async function Home() {
  const result = await db.select().from(usersTable);

  // log(JSON.stringify(result, null, 2));

  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <BookList title='Latest Books' books={sampleBooks} containerClassName='mt-28' />
    </>
  );
}
