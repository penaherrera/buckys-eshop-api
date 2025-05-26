import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

async function main() {
  // Create roles
  const roles = await prisma.role.createMany({
    data: [
      {
        name: 'Administrator',
        slug: 'admin',
      },
      {
        name: 'Client',
        slug: 'client',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Created roles:', roles);

  // Hash password for admin
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      address: '123 Main Street',
      phoneNumber: '+1234567890',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: 1,
    },
  });

  console.log('Created admin user:', adminUser);
  console.log('Admin credentials:', {
    email: 'admin@example.com',
    password: ADMIN_PASSWORD,
  });

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Music' },
      { name: 'Anime' },
      { name: 'Sports' },
      { name: 'Engineering' },
    ],
    skipDuplicates: true,
  });

  console.log('Created categories:', categories);

  // Create brands
  const brands = await prisma.brand.createMany({
    data: [
      { name: 'Gibson', description: 'Leading music brand' },
      { name: 'Studio Ghibli', description: 'Innovative animation brand' },
      { name: 'Adidas', description: 'World famous sports brand' },
      { name: 'Ravn', description: 'World class software firm' },
    ],
    skipDuplicates: true,
  });

  console.log('Created brands:', brands);

  // Create product types
  const productTypes = await prisma.productType.createMany({
    data: [{ name: 'Clothing' }, { name: 'Footwear' }, { name: 'Accessory' }],
    skipDuplicates: true,
  });

  console.log('Created product types:', productTypes);

  // Create products with variants
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Ravn T-Shirt',
        description: 'High quality engineering t-shirt',
        price: new Decimal(29.99),
        gender: 'UNISEX',
        isActive: true,
        inStock: true,
        categoryId: 4, // Engineering
        brandId: 4, // Ravn
        productTypeId: 1, // Clothing
        variants: {
          create: [
            { stock: 50, color: 'White', size: 'SMALL' },
            { stock: 30, color: 'Gray', size: 'MEDIUM' },
            { stock: 20, color: 'Black', size: 'LARGE' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Classic Adidas Pants',
        description: 'Black sport pants, great for chillin',
        price: new Decimal(59.99),
        gender: 'MALE',
        isActive: true,
        inStock: true,
        categoryId: 3, // Sports
        brandId: 3, // Adidas
        productTypeId: 1, // Clothing
        variants: {
          create: [
            { stock: 25, color: 'Black', size: 'MEDIUM' },
            { stock: 15, color: 'Black', size: 'LARGE' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Adidas Ultraboost Running Shoes',
        description: 'Premium running shoes with boost technology',
        price: new Decimal(129.99),
        gender: 'UNISEX',
        isActive: true,
        inStock: true,
        categoryId: 3, // Sports
        brandId: 3, // Adidas
        productTypeId: 2, // Footwear
        variants: {
          create: [
            { stock: 40, color: 'White', size: 'MEDIUM' },
            { stock: 35, color: 'Black', size: 'MEDIUM' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Guitar T-Shirt',
        description: 'Gibson Guitar T-Shirt',
        price: new Decimal(24.99),
        gender: 'UNISEX',
        isActive: true,
        inStock: true,
        categoryId: 1, // Music
        brandId: 1, // Gibson
        productTypeId: 1, // Clothing
        variants: {
          create: [{ stock: 100, color: 'Red/Black', size: 'LARGE' }],
        },
      },
    }),
  ]);

  console.log('Created products:', products);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
