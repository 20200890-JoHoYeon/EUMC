import {
  scryptSync,
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'crypto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { decodeBase64, encodeBase64 } from './string.util';

@Injectable()
export class CrytoUtil {
  // AES CONFIG
  protected secretKey: any;
  private IV_BLOCK_SIZE = 16;

  // HASH CONFIG
  protected hashSaltOrRounds = 10;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = scryptSync(
      this.configService.get<string>('AES_SECRETKEY'),
      'SaltIsGood',
      32,
    );
  }

  public generateRandomString = (myLength)=>{
    const chars =
      "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join("");
    return randomString;
  };


  /**
   * result string prepend IV.
   * @param text
   */
  public encodeAes = (text: string) => {
    const iv = randomBytes(this.IV_BLOCK_SIZE);
    const cipher = createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.secretKey),
      iv,
    );
    const encrypted = cipher.update(text);

    return (
      iv.toString('hex') +
      '' +
      Buffer.concat([encrypted, cipher.final()]).toString('hex')
    );
  };

  public encodeAesWithKey = (text: string, secret: string) => {
    const iv = randomBytes(this.IV_BLOCK_SIZE);
    const cipher = createCipheriv(
      'aes-256-cbc',
      Buffer.from(secret),
      iv,
    );
    const encrypted = cipher.update(text);

    return (
      iv.toString('hex') +
      '' +
      Buffer.concat([encrypted, cipher.final()]).toString('hex')
    );
  };

  public encodeAesToBase64 = (text: string) => {
    const encrypted = this.encodeAes(text);
    return encodeBase64(encrypted);
  };

  public decodeAes = (text: string) => {
    const encryptedText = Buffer.from(
      text.substring(this.IV_BLOCK_SIZE * 2, text.length),
      'hex',
    );
    const iv = Buffer.from(text.substring(0, this.IV_BLOCK_SIZE * 2), 'hex');
    const decipher = createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.secretKey),
      iv,
    );
    const decrypted = decipher.update(encryptedText);
    return Buffer.concat([decrypted, decipher.final()]).toString();
  };

  public decodeAesWithKey = (text: string, secret: string) => {
    const encryptedText = Buffer.from(
      text.substring(this.IV_BLOCK_SIZE * 2, text.length),
      'hex',
    );
    const iv = Buffer.from(text.substring(0, this.IV_BLOCK_SIZE * 2), 'hex');
    const decipher = createDecipheriv(
      'aes-256-cbc',
      Buffer.from(secret),
      iv,
    );
    const decrypted = decipher.update(encryptedText);
    return Buffer.concat([decrypted, decipher.final()]).toString();
  };


  public encodeAesToBase64WithKey = (text: string, secret: string) => {
    const encrypted = this.encodeAesWithKey(text, secret);
    return this.encodeAesToBase64(encrypted);
  };


  public decodeAesInpBase64 = (base64_text: string) => {
    base64_text = decodeBase64(base64_text);
    return this.decodeAes(base64_text);
  };

  public async generateHash(target_str: string): Promise<string> {
    return await bcrypt.hash(target_str, this.hashSaltOrRounds);
  }

  public async compareHash(
    plain_str: string,
    hashed_str: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plain_str, hashed_str);
  }
}
