import { auth, currentUser } from "@clerk/nextjs/server";
import CreateFormModal from "@/components/CreateFormModal"
import { getFormsForUser } from "@/lib/actions/getFormsForUser";
import React from "react";
import DashboardClient from "@/components/DashboardClient";


export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-blue-100 text-blue-800 rounded-xl shadow-md">
          Please login to access your dashboard.
        </div>
      </div>
    );
  }
 const forms = await getFormsForUser(user.id);
 return <DashboardClient forms={forms} />;
 
}
