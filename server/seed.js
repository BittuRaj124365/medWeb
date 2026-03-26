import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicine from './models/Medicine.js';
import Admin from './models/Admin.js';
import Supplier from './models/Supplier.js';
import AdminActivityLog from './models/AdminActivityLog.js';
import Feedback from './models/Feedback.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medweb';

const medicines = [
  {
    name: "Paracetamol 500mg",
    genericName: "Paracetamol",
    manufacturer: "PharmaCorp",
    category: "Tablet",
    price: 5.99,
    stockQuantity: 150,
    expiryDate: new Date("2025-12-31"),
    description: "Used to treat mild to moderate pain and fever.",
    usageInstructions: "Take 1-2 tablets every 4-6 hours as needed."
  },
  {
    name: "Amoxicillin 250mg",
    genericName: "Amoxicillin",
    manufacturer: "BioHealth",
    category: "Capsule",
    price: 12.50,
    stockQuantity: 50,
    expiryDate: new Date("2024-10-15"),
    description: "Antibiotic used to treat a number of bacterial infections.",
    usageInstructions: "Take 1 capsule every 8 hours."
  },
  {
    name: "Cough Syrup DM",
    genericName: "Dextromethorphan",
    manufacturer: "Relief Co",
    category: "Syrup",
    price: 8.99,
    stockQuantity: 200,
    expiryDate: new Date("2026-01-01"),
    description: "Cough suppressant for temporary relief of coughs without phlegm.",
    usageInstructions: "Take 10ml every 4 hours."
  },
  {
    name: "Vitamin C 1000mg",
    genericName: "Ascorbic Acid",
    manufacturer: "NatureLife",
    category: "Vitamins",
    price: 15.00,
    stockQuantity: 0, // Out of stock
    expiryDate: new Date("2026-05-20"),
    description: "Immune support supplement.",
    usageInstructions: "Take 1 tablet daily with a meal."
  },
  {
    name: "Insulin Glargine",
    genericName: "Insulin",
    manufacturer: "DiabetesCare",
    category: "Injection",
    price: 45.00,
    stockQuantity: 5, // Low stock
    expiryDate: new Date("2024-11-30"),
    description: "Long-acting insulin for blood sugar control.",
    usageInstructions: "Inject subcutaneously once daily."
  },
  {
    name: "Ibuprofen 400mg",
    genericName: "Ibuprofen",
    manufacturer: "PharmaCorp",
    category: "Tablet",
    price: 6.50,
    stockQuantity: 120,
    expiryDate: new Date("2025-08-15"),
    description: "Nonsteroidal anti-inflammatory drug used for reducing pain, fever, and inflammation.",
    usageInstructions: "Take 1 tablet every 6 to 8 hours."
  },
  {
    name: "Eye Drops Lubricating",
    genericName: "Artificial Tears",
    manufacturer: "VisionClear",
    category: "Drops",
    price: 9.99,
    stockQuantity: 80,
    expiryDate: new Date("2025-02-28"),
    description: "Moisturizing eye drops for dry eyes.",
    usageInstructions: "Instill 1-2 drops in the affected eye(s) as needed."
  },
  {
    name: "Hydrocortisone Cream 1%",
    genericName: "Hydrocortisone",
    manufacturer: "SkinHealth",
    category: "Ointment",
    price: 7.25,
    stockQuantity: 65,
    expiryDate: new Date("2026-07-20"),
    description: "Topical steroid used to treat inflammation and itching.",
    usageInstructions: "Apply a thin layer to the affected area 2 to 4 times a day."
  },
  {
    name: "Multivitamin Complex",
    genericName: "Vitamins & Minerals",
    manufacturer: "NatureLife",
    category: "Vitamins",
    price: 18.50,
    stockQuantity: 9, // Low stock
    expiryDate: new Date("2025-11-10"),
    description: "Daily multivitamin to support overall health.",
    usageInstructions: "Take 1 tablet daily."
  },
  {
    name: "Saline Nasal Spray",
    genericName: "Sodium Chloride",
    manufacturer: "BreatheEasy",
    category: "Other",
    price: 5.50,
    stockQuantity: 110,
    expiryDate: new Date("2024-12-12"),
    description: "Helps relieve nasal congestion and dryness.",
    usageInstructions: "Spray 1-2 times in each nostril as needed."
  },
  {
    name: "Cetirizine 10mg",
    genericName: "Cetirizine Hydrochloride",
    manufacturer: "AllergyRelief",
    category: "Tablet",
    price: 11.00,
    stockQuantity: 90,
    expiryDate: new Date("2025-09-05"),
    description: "Antihistamine used for allergy relief.",
    usageInstructions: "Take 1 tablet daily."
  },
  {
    name: "Ciprofloxacin 500mg",
    genericName: "Ciprofloxacin",
    manufacturer: "BioHealth",
    category: "Tablet",
    price: 14.20,
    stockQuantity: 0, // Out of stock
    expiryDate: new Date("2024-10-01"),
    description: "Antibiotic used to treat various bacterial infections.",
    usageInstructions: "Take 1 tablet every 12 hours."
  },
  {
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    manufacturer: "StomachCare",
    category: "Capsule",
    price: 13.75,
    stockQuantity: 60,
    expiryDate: new Date("2026-03-15"),
    description: "Proton pump inhibitor used to treat GERD and stomach ulcers.",
    usageInstructions: "Take 1 capsule daily before a meal."
  },
  {
    name: "Azithromycin 250mg",
    genericName: "Azithromycin",
    manufacturer: "PharmaCorp",
    category: "Tablet",
    price: 16.00,
    stockQuantity: 40,
    expiryDate: new Date("2025-04-30"),
    description: "Macrolide antibiotic used to treat numerous bacterial infections.",
    usageInstructions: "Take 2 tablets on day 1, then 1 tablet daily for 4 days."
  },
  {
    name: "Vitamin D3 2000 IU",
    genericName: "Cholecalciferol",
    manufacturer: "NatureLife",
    category: "Vitamins",
    price: 10.50,
    stockQuantity: 150,
    expiryDate: new Date("2026-08-22"),
    description: "Supports bone health and immune function.",
    usageInstructions: "Take 1 softgel daily."
  },
  {
    name: "Epinephrine Auto-Injector",
    genericName: "Epinephrine",
    manufacturer: "LifeSaver",
    category: "Injection",
    price: 120.00,
    stockQuantity: 2, // Low stock
    expiryDate: new Date("2024-09-10"),
    description: "Used for emergency treatment of severe allergic reactions (anaphylaxis).",
    usageInstructions: "Inject into the outer thigh as directed during a severe allergic reaction."
  },
  {
    name: "Loradatine 10mg",
    genericName: "Loratadine",
    manufacturer: "AllergyRelief",
    category: "Tablet",
    price: 9.50,
    stockQuantity: 85,
    expiryDate: new Date("2025-06-18"),
    description: "Non-drowsy antihistamine for allergy relief.",
    usageInstructions: "Take 1 tablet daily."
  },
  {
    name: "Loperamide 2mg",
    genericName: "Loperamide",
    manufacturer: "DigestiveHealth",
    category: "Capsule",
    price: 6.99,
    stockQuantity: 130,
    expiryDate: new Date("2026-11-05"),
    description: "Used to treat sudden diarrhea.",
    usageInstructions: "Take 2 capsules initially, then 1 capsule after each loose stool."
  },
  {
    name: "Clotrimazole Cream 1%",
    genericName: "Clotrimazole",
    manufacturer: "SkinHealth",
    category: "Ointment",
    price: 5.80,
    stockQuantity: 70,
    expiryDate: new Date("2025-10-12"),
    description: "Antifungal medication used to treat skin infections.",
    usageInstructions: "Apply to the affected area twice a day."
  },
  {
    name: "Tetanus Toxoid Vaccine",
    genericName: "Tetanus Toxoid",
    manufacturer: "VaxCorp",
    category: "Injection",
    price: 25.00,
    stockQuantity: 0, // Out of stock
    expiryDate: new Date("2024-08-20"),
    description: "Vaccine used to prevent tetanus.",
    usageInstructions: "Administered by a healthcare professional."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    await Medicine.deleteMany();
    await Admin.deleteMany();
    await Supplier.deleteMany();
    await AdminActivityLog.deleteMany();
    await Feedback.deleteMany();

    console.log('Data Cleared!');

    // Create an Admin Admin User
    const adminUser = new Admin({
      username: 'admin',
      password: 'password123'
    });
    await adminUser.save();

    console.log('Admin user created (username: admin, password: password123)');

    // Create Suppliers
    const suppliersData = [
      { name: "PharmaCorp", contactNumber: "123-456-7890", email: "contact@pharmacorp.com", address: "123 Pharma St" },
      { name: "BioHealth", contactNumber: "098-765-4321", email: "sales@biohealth.com", address: "456 Bio Ave" },
      { name: "Relief Co", contactNumber: "555-123-4567", email: "info@reliefco.com", address: "789 Relief Blvd" },
      { name: "NatureLife", contactNumber: "444-987-6543", email: "support@naturelife.com", address: "321 Nature Rd" },
      { name: "DiabetesCare", contactNumber: "333-555-7777", email: "care@diabetescare.com", address: "654 Care Ln" },
      { name: "VisionClear", contactNumber: "222-333-4444", email: "hello@visionclear.com", address: "987 Vision Way" },
      { name: "SkinHealth", contactNumber: "111-222-3333", email: "dermatology@skinhealth.com", address: "147 Skin Dr" },
      { name: "BreatheEasy", contactNumber: "888-999-0000", email: "air@breatheeasy.com", address: "258 Air Pl" },
      { name: "AllergyRelief", contactNumber: "777-888-9999", email: "sneeze@allergyrelief.com", address: "369 Allergy St" },
      { name: "StomachCare", contactNumber: "666-777-8888", email: "gut@stomachcare.com", address: "753 Gut Ave" },
      { name: "LifeSaver", contactNumber: "444-333-2222", email: "save@lifesaver.com", address: "951 Save Blvd" },
      { name: "DigestiveHealth", contactNumber: "555-666-7777", email: "digest@digestivehealth.com", address: "357 Digest Rd" },
      { name: "VaxCorp", contactNumber: "999-000-1111", email: "vax@vaxcorp.com", address: "159 Vax Ln" }
    ];
    
    const createdSuppliers = await Supplier.insertMany(suppliersData);
    console.log(`Inserted ${createdSuppliers.length} Suppliers`);
    
    // Map supplier name to ObjectId
    const supplierMap = createdSuppliers.reduce((acc, curr) => {
       acc[curr.name] = curr._id;
       return acc;
    }, {});

    const medicinesWithDetails = medicines.map(med => ({
      ...med,
      supplier: supplierMap[med.manufacturer],
      purchasePrice: Number((med.price * 0.7).toFixed(2)),
      batchNumber: `BATCH-${Math.floor(Math.random() * 10000)}`,
      batches: [
        { batchNumber: `BATCH-${Math.floor(Math.random() * 10000)}`, expiryDate: med.expiryDate || new Date("2026-12-31"), quantity: med.stockQuantity }
      ],
      restockHistory: [
        { date: new Date(), quantityAdded: med.stockQuantity, restockedBy: 'admin' }
      ]
    }));

    const insertedMedicines = await Medicine.insertMany(medicinesWithDetails);
    console.log(`Inserted ${insertedMedicines.length} Medicines`);

    // Create mock feedbacks
    const mockFeedbacks = [];
    for(let med of insertedMedicines) {
      mockFeedbacks.push({
        medicine: med._id,
        userName: "John Doe",
        userEmail: "john@example.com",
        rating: 4,
        message: "Good medicine, fast delivery.",
        approved: true
      });
      mockFeedbacks.push({
        medicine: med._id,
        userName: "Jane Smith",
        userEmail: "jane@example.com",
        rating: 5,
        message: "Very effective.",
        approved: true
      });
      
      med.totalRatingCount = 2;
      med.averageRating = 4.5;
      med.viewCount = Math.floor(Math.random() * 100);
      med.searchCount = Math.floor(Math.random() * 50);
      await med.save();
    }

    await Feedback.insertMany(mockFeedbacks);
    console.log(`Inserted ${mockFeedbacks.length} Feedbacks`);

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
