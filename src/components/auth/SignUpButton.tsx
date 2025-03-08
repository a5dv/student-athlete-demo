'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

type Provider = {
  id: string;
  name: string;
};

type SignUpButtonProps = {
  provider: Provider;
};

export function SignUpButton({ provider }: SignUpButtonProps) {
  return (
    <div>
      <Button onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })} className="w-full">
        <GoogleIcon />
        Sign Up with {provider.name}
      </Button>
    </div>
  );
}
