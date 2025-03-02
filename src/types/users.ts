import { Role, UserStatus } from "@prisma/client"
import { PaginationOptions, PaginatedResult } from "./common/pagination"

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  role?: Role;
}

// Re-export if needed for backward compatibility
export type { PaginationOptions, PaginatedResult }