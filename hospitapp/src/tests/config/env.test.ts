import { _ENV } from '@/config/env';

describe('Environment Variables', () => {
  it('should validate and load environment variables', () => {
    expect(_ENV.NEXT_PUBLIC_API_URL).toBe("http://localhost:3000/api");
    expect(_ENV.NEXT_PUBLIC_APP_NAME).toBe("HospitApp");
    expect(_ENV.DATABASE_URL).toBeDefined();
  });
});