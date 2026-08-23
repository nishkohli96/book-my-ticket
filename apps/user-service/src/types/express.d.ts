declare global {
  namespace Express {
    interface Request {
      /**
       * Only set on routes behind the `authenticate` middleware - optional
       * because this augments every Express Request globally, including
       * unprotected routes (signup, login, oauth) where it's never set.
       */
      userId?: string;
    }
  }
}

export {};
