import { getPaymentInfo } from "@/components/api-access/payment-information";
import { getTutions } from "@/components/api-access/tutions";
import { getUser } from "@/components/api-access/users";
import AdminPageClient from "@/components/dashboard/admin-page-client";
import type { IPaymented } from "@/components/api-access/payment-information";
import type { TuitionApplication } from "@/components/type/tution";
import type { IUser } from "@/components/type/user";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [tuitionsResult, usersResult, paymentsResult] = await Promise.allSettled([
    getTutions(),
    getUser(),
    getPaymentInfo(),
  ]);

  const tuitions: TuitionApplication[] =
    tuitionsResult.status === "fulfilled" ? tuitionsResult.value : [];
  const tuitionsError =
    tuitionsResult.status === "rejected"
      ? tuitionsResult.reason instanceof Error
        ? tuitionsResult.reason.message
        : "Could not load tuition listings from the server."
      : null;

  const users: IUser[] =
    usersResult.status === "fulfilled" ? usersResult.value : [];
  const usersError =
    usersResult.status === "rejected"
      ? usersResult.reason instanceof Error
        ? usersResult.reason.message
        : "Could not load users from the server."
      : null;

  const payments: IPaymented[] =
    paymentsResult.status === "fulfilled" ? paymentsResult.value : [];
  const paymentsError =
    paymentsResult.status === "rejected"
      ? paymentsResult.reason instanceof Error
        ? paymentsResult.reason.message
        : "Could not load transactions from the server."
      : null;

  return (
    <AdminPageClient
      tuitions={tuitions}
      tuitionsError={tuitionsError}
      users={users}
      usersError={usersError}
      payments={payments}
      paymentsError={paymentsError}
    />
  );
}
