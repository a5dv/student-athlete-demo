import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import UsersTable from "./components/UsersTable";
import { Role, UserStatus } from "@prisma/client";
import { getUsers } from "@/services/users/queries";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage user registrations and roles",
};

export default async function UsersPage({
  searchParams: asyncSearchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }
  
  const searchParams = await asyncSearchParams;
  
  // Get pagination parameters
  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.perPage) || 15;
  
  // Get filter parameters
  const status = searchParams.status as UserStatus | undefined;
  const role = searchParams.role as Role | undefined;
  const search = searchParams.search as string | undefined;

  // Use the getUsers function from queries.ts
  const filters = {
    status,
    role,
    search,
  }

  const paginationOptions = {
    page,
    perPage,
  }

  const { data: users, pagination } = await getUsers(filters, paginationOptions);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage user registrations, approve new users, and modify roles
        </p>
      </div>
      
      <UsersTable 
        initialData={users}   
        totalPages={pagination.totalPages} 
        currentPage={pagination.currentPage} 
        perPage={pagination.perPage}
      />
    </div>
  );
}