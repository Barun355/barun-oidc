import type { Request, Response } from "express";
export declare const getSignIn: (req: Request, res: Response) => Promise<void>;
export declare const getSignUp: (req: Request, res: Response) => Promise<void>;
export declare const generateToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserInfo: (req: Request, res: Response) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response) => Promise<void>;
export declare const signInUser: (req: Request, res: Response) => Promise<void>;
export declare const signUpUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=controller.d.ts.map