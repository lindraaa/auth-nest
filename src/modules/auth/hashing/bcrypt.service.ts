import { compare, genSalt, hash } from 'bcrypt';

export class BcryptService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return await hash(data, salt);
  }
  compare(data: string | Buffer, encrypted: string): Promise<Boolean> {
    return compare(data, encrypted);
  }
}
