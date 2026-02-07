import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private users: UsersService) {}

  async register(email: string, password: string, name?: string) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new Error('User already exists');
    const hash = await bcrypt.hash(password, 10);
    const user = await this.users.create(email, hash, name);
    return this.issueTokens(user.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');
    return this.issueTokens(user.id, user.email, user.role);
  }

  private issueTokens(userId: string, email: string, role: string) {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const accessTtl = process.env.JWT_EXPIRES_IN || '15m';
    const refreshTtl = process.env.REFRESH_EXPIRES_IN || '7d';
    const accessToken = jwt.sign({ sub: userId, email, role }, secret, { expiresIn: accessTtl });
    const refreshToken = jwt.sign({ sub: userId, email, role, type: 'refresh' }, secret, { expiresIn: refreshTtl });
    return { accessToken, refreshToken };
  }
}
