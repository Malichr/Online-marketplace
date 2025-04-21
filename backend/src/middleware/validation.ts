import { Request, Response, NextFunction } from 'express';

export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password, role } = req.body;

  console.log('Validating registration data:', {
    hasUsername: !!username,
    hasPassword: !!password,
    passwordType: typeof password,
    role
  });

  if (!username || !password || !role) {
    res.status(400).json({ message: 'Minden mező kitöltése kötelező' });
    return;
  }

  const passwordStr = String(password);

  if (username.length < 3 || username.length > 20) {
    res.status(400).json({ 
      message: 'A felhasználónévnek 3-20 karakter hosszúnak kell lennie' 
    });
    return;
  }

  if (passwordStr.length < 6) {
    res.status(400).json({ 
      message: 'A jelszónak legalább 6 karakter hosszúnak kell lennie' 
    });
    return;
  }

  if (!['buyer', 'seller'].includes(role)) {
    res.status(400).json({ message: 'Érvénytelen szerepkör' });
    return;
  }

  req.body.password = passwordStr;
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Minden mező kitöltése kötelező' });
    return;
  }

  next();
}; 