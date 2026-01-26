import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a demo user (password: 'password123')
  const hashedPassword = "$2b$10$YourHashedPasswordHere"; // Will be replaced by actual hash

  const user = await prisma.user.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      username: "demo",
      password: hashedPassword,
    },
  });

  console.log("Created user:", user);

  // Create expense categories
  const foodCategory = await prisma.category.create({
    data: {
      name: "Food",
      type: "EXPENSE",
      userId: user.id,
      children: {
        create: [
          { name: "Breakfast", type: "EXPENSE", userId: user.id },
          { name: "Lunch", type: "EXPENSE", userId: user.id },
          { name: "Dinner", type: "EXPENSE", userId: user.id },
          { name: "Drinks", type: "EXPENSE", userId: user.id },
          { name: "Snacks", type: "EXPENSE", userId: user.id },
          { name: "Groceries", type: "EXPENSE", userId: user.id },
          { name: "Others", type: "EXPENSE", userId: user.id },
        ],
      },
    },
  });

  const transportCategory = await prisma.category.create({
    data: {
      name: "Transportation",
      type: "EXPENSE",
      userId: user.id,
      children: {
        create: [
          { name: "Fuel", type: "EXPENSE", userId: user.id },
          { name: "Maintenance", type: "EXPENSE", userId: user.id },
          { name: "Taxi", type: "EXPENSE", userId: user.id },
          { name: "Bus", type: "EXPENSE", userId: user.id },
        ],
      },
    },
  });

  const billsCategory = await prisma.category.create({
    data: {
      name: "Bills",
      type: "EXPENSE",
      userId: user.id,
      children: {
        create: [
          { name: "Rent", type: "EXPENSE", userId: user.id },
          { name: "Phone", type: "EXPENSE", userId: user.id },
          { name: "Internet", type: "EXPENSE", userId: user.id },
        ],
      },
    },
  });

  const fashionCategory = await prisma.category.create({
    data: {
      name: "Fashion",
      type: "EXPENSE",
      userId: user.id,
      children: {
        create: [
          { name: "Clothes", type: "EXPENSE", userId: user.id },
          { name: "Shoes", type: "EXPENSE", userId: user.id },
          { name: "Accessories", type: "EXPENSE", userId: user.id },
        ],
      },
    },
  });

  // Create income categories
  const salaryCategory = await prisma.category.create({
    data: {
      name: "Salary",
      type: "INCOME",
      userId: user.id,
      children: {
        create: [
          { name: "Full-time", type: "INCOME", userId: user.id },
          { name: "Part-time", type: "INCOME", userId: user.id },
          { name: "Bonus", type: "INCOME", userId: user.id },
        ],
      },
    },
  });

  const investmentCategory = await prisma.category.create({
    data: {
      name: "Investment",
      type: "INCOME",
      userId: user.id,
      children: {
        create: [
          { name: "Dividends", type: "INCOME", userId: user.id },
          { name: "Interest", type: "INCOME", userId: user.id },
        ],
      },
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
