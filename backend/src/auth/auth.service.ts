import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    // Public registration always creates a VIEWER (no role escalation possible)
    const user = await this.users.save(
      this.users.create({
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: await bcrypt.hash(dto.password, 10),
      }),
    );
    return this.issueSession(user);
  }

  async login(dto: LoginDto) {
    // password is select:false, so it must be requested explicitly
    const user = await this.users
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email: dto.email })
      .getOne();

    const valid = user && user.isActive && (await bcrypt.compare(dto.password, user.password));
    if (!user || !valid) throw new UnauthorizedException('Invalid credentials');
    return this.issueSession(user);
  }

  async refresh(userId: string, rawRefreshToken: string) {
    const user = await this.users
      .createQueryBuilder('u')
      .addSelect('u.refreshTokenHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw new UnauthorizedException('Session expired');
    }
    // Rotation: a token that does not match the stored one was already used -> revoke the session
    if (user.refreshTokenHash !== this.hash(rawRefreshToken)) {
      await this.users.update(userId, { refreshTokenHash: null });
      throw new UnauthorizedException('Refresh token reuse detected, please log in again');
    }
    return this.issueSession(user);
  }

  async logout(userId: string) {
    await this.users.update(userId, { refreshTokenHash: null });
  }

  // ---------- helpers ----------

  private async issueSession(user: User) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), expiresIn: '15m' },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, jti: randomUUID() },
      { secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'), expiresIn: '7d' },
    );

    await this.users.update(user.id, { refreshTokenHash: this.hash(refreshToken) });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
      accessToken,
      refreshToken,
    };
  }

  // SHA-256 (not bcrypt: bcrypt only reads the first 72 bytes, and a JWT's start is nearly identical every time)
  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}