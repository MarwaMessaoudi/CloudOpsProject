import { Body, Controller, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

const COOKIE_NAME = 'refresh_token';
const COOKIE_PATH = '/auth'; // the cookie is only sent to /auth/* routes

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private setCookie(res: Response, token: string) {
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: COOKIE_PATH,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Create an account (VIEWER role)' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...session } = await this.auth.register(dto);
    this.setCookie(res, refreshToken);
    return session;
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Login: returns access token + sets refresh cookie' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...session } = await this.auth.login(dto);
    this.setCookie(res, refreshToken);
    return session;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post('refresh')
  @ApiCookieAuth(COOKIE_NAME)
  @ApiOperation({ summary: 'Get a new access token (refresh token is rotated)' })
  async refresh(
    @CurrentUser() user: { id: string; refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...session } = await this.auth.refresh(user.id, user.refreshToken);
    this.setCookie(res, refreshToken);
    return session;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(204)
  @Post('logout')
  @ApiCookieAuth(COOKIE_NAME)
  @ApiOperation({ summary: 'Logout: revokes the refresh token' })
  async logout(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(userId);
    res.clearCookie(COOKIE_NAME, { path: COOKIE_PATH });
  }
}