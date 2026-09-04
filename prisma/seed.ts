import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = [
  { name: "Priya Sharma", email: "priya@acme.com", department: "Engineering", role: "Senior Software Engineer", status: "Active", avatarColor: "#6366f1" },
  { name: "David Chen", email: "david.chen@acme.com", department: "Engineering", role: "Frontend Developer", status: "Active", avatarColor: "#0ea5e9" },
  { name: "Sofia Rodriguez", email: "sofia@acme.com", department: "Design", role: "Product Designer", status: "Active", avatarColor: "#ec4899" },
  { name: "James Wilson", email: "james@acme.com", department: "Marketing", role: "Marketing Lead", status: "On Leave", avatarColor: "#f59e0b" },
  { name: "Aisha Khan", email: "aisha@acme.com", department: "Sales", role: "Account Executive", status: "Active", avatarColor: "#10b981" },
  { name: "Marcus Johnson", email: "marcus@acme.com", department: "Human Resources", role: "HR Manager", status: "Active", avatarColor: "#8b5cf6" },
  { name: "Emily Davis", email: "emily@acme.com", department: "Finance", role: "Financial Analyst", status: "Terminated", avatarColor: "#ef4444" },
  { name: "Rohan Patel", email: "rohan@acme.com", department: "Engineering", role: "Backend Engineer", status: "Active", avatarColor: "#14b8a6" },
  { name: "Maya Thomas", email: "maya@acme.com", department: "Customer Support", role: "Support Specialist", status: "On Leave", avatarColor: "#0ea5e9" },
  { name: "Daniel Lee", email: "daniel@acme.com", department: "Operations", role: "Operations Manager", status: "Active", avatarColor: "#6366f1" },
];

async function main() {
  const existing = await prisma.employee.count();
  if (existing === 0) {
    for (const data of seedData) {
      await prisma.employee.create({ data });
    }
    console.log(`Seeded ${seedData.length} employees.`);
  } else {
    console.log(`Skipping seed, ${existing} employees already exist.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
