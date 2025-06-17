import React from "react";
import { Button } from "react-day-picker";
import { Form, FormGroup, FormLabel, Input } from "../ui/form";
import { useAuth } from "@/lib/auth-context";

export default function CompanyDashboard() {
  const { user } = useAuth();
  // State for forms
  const [companyForm, setCompanyForm] = React.useState({
    simulationId: "",
    name: "",
    description: "",
  });

  const handleCompanyInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
  };
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/company/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...companyForm,
          userId: user?.id,
          cashBalance: 1000000,
          totalAssets: 1000000,
          totalLiabilities: 0,
          creditRating: "AA",
          brandValue: 50000,
          data: "{}",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        // Refresh simulation state to update userCompany
        window.location.reload(); // Temporary; ideally use refreshState()
      } else {
        throw new Error("Failed to create company");
      }
    } catch (error) {
      console.error("Company creation failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">No company found</h2>
      <p>Create a company to start the simulation.</p>
      <Form onSubmit={handleCreateCompany} className="space-y-4 mt-4">
        <FormGroup>
          <FormLabel htmlFor="name">Company Name</FormLabel>
          <Input
            id="name"
            name="name"
            value={companyForm.name}
            onChange={handleCompanyInput}
            placeholder="Enter company name"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input
            id="description"
            name="description"
            value={companyForm.description}
            onChange={handleCompanyInput}
            placeholder="Enter description"
          />
        </FormGroup>
        <Button type="submit">Create Company</Button>
      </Form>
    </div>
  );
};
