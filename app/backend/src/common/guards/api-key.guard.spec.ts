import { ApiKeyGuard } from './api-key.guard';
import { UnauthorizedException } from '@nestjs/common';
import { AppRole } from '../../auth/app-role.enum';

const mockReflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
const mockConfigService = { get: jest.fn().mockReturnValue('test-api-key') };
const mockPrismaService = {
  apiKey: {
    findUnique: jest.fn(),
  },
};

const createContext = (headers: Record<string, string>) => {
  const req: Record<string, unknown> = { headers };
  return {
    switchToHttp: () => ({
      getRequest: () => req,
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  };
};

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockConfigService.get.mockReturnValue('test-api-key');
    mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

    guard = new ApiKeyGuard(
      mockConfigService as any,
      mockReflector as any,
      mockPrismaService as any,
    );
  });

  it('should allow request with valid API key found in DB and attach role', async () => {
    mockPrismaService.apiKey.findUnique.mockResolvedValue({
      id: '1',
      key: 'test-api-key',
      role: AppRole.admin,
    });

    const context = createContext({ 'x-api-key': 'test-api-key' });
    const result = await guard.canActivate(context as any);

    expect(result).toBe(true);
    const req = context.switchToHttp().getRequest() as any;
    expect(req.user).toEqual({ role: AppRole.admin });
  });

  it('should attach correct role from DB record for operator', async () => {
    mockPrismaService.apiKey.findUnique.mockResolvedValue({
      id: '2',
      key: 'operator-key',
      role: AppRole.operator,
    });

    const context = createContext({ 'x-api-key': 'operator-key' });
    await guard.canActivate(context as any);

    const req = context.switchToHttp().getRequest() as any;
    expect(req.user).toEqual({ role: AppRole.operator });
  });

  it('should fall back to env key and assign admin role when no DB record', async () => {
    mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

    const context = createContext({ 'x-api-key': 'test-api-key' });
    const result = await guard.canActivate(context as any);

    expect(result).toBe(true);
    const req = context.switchToHttp().getRequest() as any;
    expect(req.user).toEqual({ role: AppRole.admin });
  });

  it('should throw UnauthorizedException with missing API key', async () => {
    const context = createContext({});
    await expect(guard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException with invalid API key (no DB record, no env match)', async () => {
    mockPrismaService.apiKey.findUnique.mockResolvedValue(null);
    mockConfigService.get.mockReturnValue('different-env-key');

    const context = createContext({ 'x-api-key': 'wrong-key' });
    await expect(guard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow public routes without API key', async () => {
    mockReflector.getAllAndOverride.mockReturnValueOnce(true);
    const context = createContext({});
    const result = await guard.canActivate(context as any);
    expect(result).toBe(true);
  });
});
