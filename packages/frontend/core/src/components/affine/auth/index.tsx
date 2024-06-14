import type { AuthModalProps as AuthModalBaseProps } from '@affine/component/auth-components';
import { AuthModal as AuthModalBase } from '@affine/component/auth-components';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';

import { AfterSignInSendEmail } from './after-sign-in-send-email';
import { AfterSignUpSendEmail } from './after-sign-up-send-email';
import { SendEmail } from './send-email';
import { SignIn } from './sign-in';
import { SignInWithPassword } from './sign-in-with-password';

export type AuthProps = {
  state:
    | 'signIn'
    | 'afterSignUpSendEmail'
    | 'afterSignInSendEmail'
    // throw away
    | 'signInWithPassword'
    | 'sendEmail';
  setAuthState: (state: AuthProps['state']) => void;
  setAuthEmail: (state: AuthProps['email']) => void;
  setEmailType: (state: AuthProps['emailType']) => void;
  email: string;
  emailType: 'setPassword' | 'changePassword' | 'changeEmail' | 'verifyEmail';
  onSignedIn?: () => void;
};

export type AuthPanelProps = {
  email: string;
  setAuthState: AuthProps['setAuthState'];
  setAuthEmail: AuthProps['setAuthEmail'];
  setEmailType: AuthProps['setEmailType'];
  emailType: AuthProps['emailType'];
  onSignedIn?: () => void;
};

const config: {
  [k in AuthProps['state']]: FC<AuthPanelProps>;
} = {
  signIn: SignIn,
  afterSignUpSendEmail: AfterSignUpSendEmail,
  afterSignInSendEmail: AfterSignInSendEmail,
  signInWithPassword: SignInWithPassword,
  sendEmail: SendEmail,
};

export const AuthModal: FC<AuthModalBaseProps & AuthProps> = ({
  open,
  state,
  setOpen,
  email,
  setAuthEmail,
  setAuthState,
  setEmailType,
  emailType,
}) => {
  const onSignedIn = useCallback(() => {
    setAuthState('signIn');
    setAuthEmail('');
    setOpen(false);
  }, [setAuthState, setAuthEmail, setOpen]);

  return (
    <AuthModalBase open={open} setOpen={setOpen}>
      <AuthPanel
        state={state}
        email={email}
        setAuthEmail={setAuthEmail}
        setAuthState={setAuthState}
        setEmailType={setEmailType}
        emailType={emailType}
        onSignedIn={onSignedIn}
      />
    </AuthModalBase>
  );
};

export const AuthPanel: FC<AuthProps> = ({
  state,
  email,
  setAuthEmail,
  setAuthState,
  setEmailType,
  emailType,
  onSignedIn,
}) => {
  const CurrentPanel = useMemo(() => {
    return config[state];
  }, [state]);

  return (
    <CurrentPanel
      email={email}
      setAuthState={setAuthState}
      setAuthEmail={setAuthEmail}
      setEmailType={setEmailType}
      emailType={emailType}
      onSignedIn={onSignedIn}
    />
  );
};
