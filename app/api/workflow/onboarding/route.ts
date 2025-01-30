import { serve } from '@upstash/workflow/nextjs';
import { eq } from 'drizzle-orm';

import { db } from '@/database/drizzle';
import { usersTable } from '@/database/schema';

type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  // Welcome email
  await context.run('new-signup', async () => {
    await sendEmail({ message: `Welcome ${fullName}`, email: email, subject: 'Welcome to the platform' });
  });

  await context.sleep('wait-for-3-days', 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run('check-user-state', async () => {
      return await getUserState(email);
    });

    if (state === 'non-active') {
      await context.run('send-email-non-active', async () => {
        await sendEmail({ message: 'Email to non-active users', email, subject: 'are u still here' });
      });
    } else if (state === 'active') {
      await context.run('send-email-active', async () => {
        await sendEmail({ message: 'Send newsletter to active users', email, subject: 'hey you' });
      });
    }

    await context.sleep('wait-for-1-month', 60 * 60 * 24 * 30);
  }
});

async function sendEmail({ message, email, subject }: { message: string; email: string; subject: string }) {
  // Implement email sending logic here
  console.log(`Sending ${message} email to ${email}`);
}

type UserState = 'non-active' | 'active';

const getUserState = async (email: string): Promise<UserState> => {
  // Implement user state logic here
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (user.length === 0) return 'non-active';

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (timeDifference > 3 * ONE_DAY_IN_MS) return 'non-active';

  return 'active';
};
