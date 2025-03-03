import { _ENV } from '@/config/env';


describe('Environment Variables Test', () => {
  // Test the environment variables in the .env.test file, matching the values with the expected values
  it('should validate and load environment variables', () => {
    expect(_ENV.NEXT_PUBLIC_API_URL).toBe("http://localhost:3000/api");
    expect(_ENV.NEXT_PUBLIC_APP_NAME).toBe("HospitApp");
    expect(_ENV.DATABASE_URL).toBeDefined();
    expect(_ENV.DATABASE_NAME).toBe("HospitAppDev");
  });
});