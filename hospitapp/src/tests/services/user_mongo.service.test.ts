import { Container } from "inversify";
import { UserMongoService } from "@/services/user_mongo.service";
import { TYPES } from "@/adapters/types";
import type UserRepositoryAdapter from "@/adapters/repositories/user_repository.adapter";
import type UserServiceAdapter from "@/adapters/services/user.service.adapter";
import { User } from "@/models/user"; // Adjust path if you have a User model

describe("UserMongoService", () => {
  let service: UserMongoService;
  let mockUserRepository: jest.Mocked<UserRepositoryAdapter>;
  let container: Container;

  // Mock User instance
  const mockUser = {
    getRole: jest.fn().mockReturnValue("admin"),
    getEmail: jest.fn().mockReturnValue("test@example.com"), // Optional, for completeness
  } as unknown as User; // Adjust based on your User class

  beforeAll(() => {
    // Setup Inversify container
    container = new Container();

    // Mock UserRepositoryAdapter
    mockUserRepository = {
      findUserByEmail: jest.fn().mockResolvedValue(mockUser),
	  createUser: jest.fn().mockResolvedValue(true)
    } as jest.Mocked<UserRepositoryAdapter>;

    // Bind mocks to container
    container
      .bind<UserRepositoryAdapter>(TYPES.UserRepositoryAdapter)
      .toConstantValue(mockUserRepository);
    container
      .bind<UserServiceAdapter>(TYPES.UserServiceAdapter)
      .to(UserMongoService);

    // Get service instance
    service = container.get<UserMongoService>(TYPES.UserServiceAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  describe("verifyUserRole", () => {
    it("should return true if user exists and has the correct role", async () => {
      const result = await service.verifyUserRole("test@example.com", "admin");

      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUser.getRole).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return false if user does not exist", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      const result = await service.verifyUserRole("nonexistent@example.com", "admin");

      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("nonexistent@example.com");
      expect(mockUser.getRole).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should return false if user has a different role", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      (mockUser.getRole as jest.Mock).mockReturnValue("user"); // Different role

      const result = await service.verifyUserRole("test@example.com", "admin");

      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUser.getRole).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should return false if repository throws an error", async () => {
      const error = new Error("Database error");
      mockUserRepository.findUserByEmail.mockRejectedValue(error);

      const result = await service.verifyUserRole("test@example.com", "admin");

      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUser.getRole).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});