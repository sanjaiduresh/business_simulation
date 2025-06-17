// import { Simulation } from "@/components/simulation/types";

// export class SimulationService {
//   static async createSimulation(name: string, description: string, userId: string): Promise<string> {
//     const response = await fetch("/api/simulations/create", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ simulationName: name, description }),
//     });
//     if (!response.ok) throw new Error("Failed to create simulation");
//     const { simulationId } = await response.json() as { simulationId: string };
//     return simulationId;
//   }

//   static async getSimulations(userId: string): Promise<Simulation[]> {
//     const response = await fetch("/api/simulations");
//     if (!response.ok) throw new Error("Failed to fetch simulations");
//     const { simulations } = await response.json() as { simulations: Simulation[] };
//     return simulations || [];
//   }

//   static async createCompany(simulationId: string, name: string, description: string): Promise<string> {
//     const response = await fetch("/api/company/create", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ simulationId, name, description }),
//     });
//     if (!response.ok) throw new Error("Failed to create company");
//     const { companyId } = await response.json() as { companyId: string };
//     return companyId;
//   }
// }