// Mock data for CBSE GUY e-commerce platform

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  image: string;
  images: string[];
  class: string;
  subject: string;
  board: string;
  format: "PDF" | "Physical" | "Combo";
  tags: string[];
  badges: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviews: number;
  isBestSeller: boolean;
  isNew: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Verified" | "Failed";
  items: CartItem[];
  total: number;
  discount: number;
  trackingLink?: string;
  courier?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  totalOrders: number;
  totalReferrals: number;
  referralRewards: number;
}

export interface Notification {
  id: string;
  type: "order" | "referral" | "promo" | "system";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    title: "NCERT Physics Class 12",
    subtitle: "Complete Solutions with Diagrams",
    description: "Comprehensive guide covering all chapters with detailed explanations, solved examples, and practice questions. Perfect for board exams and competitive preparation.",
    price: 299,
    mrp: 499,
    discount: 40,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1000&fit=crop",
    ],
    class: "12",
    subject: "Physics",
    board: "CBSE",
    format: "PDF",
    tags: ["NCERT", "Board Exam", "JEE"],
    badges: ["Best Seller"],
    inStock: true,
    stockCount: 150,
    rating: 4.8,
    reviews: 234,
    isBestSeller: true,
    isNew: false,
  },
  {
    id: "2",
    title: "Chemistry Master Guide Class 12",
    subtitle: "Organic, Inorganic & Physical Chemistry",
    description: "All-in-one chemistry guide with reaction mechanisms, formulas, and numerical problems. Includes tips from toppers.",
    price: 349,
    mrp: 599,
    discount: 42,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1000&fit=crop",
    ],
    class: "12",
    subject: "Chemistry",
    board: "CBSE",
    format: "Combo",
    tags: ["NCERT", "Board Exam", "NEET"],
    badges: ["New 2025 Edition"],
    inStock: true,
    stockCount: 89,
    rating: 4.7,
    reviews: 156,
    isBestSeller: false,
    isNew: true,
  },
  {
    id: "3",
    title: "Mathematics Class 11 Complete",
    subtitle: "NCERT + Extra Questions",
    description: "Master mathematics with step-by-step solutions, theorems, and plenty of practice problems.",
    price: 279,
    mrp: 449,
    discount: 38,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=1000&fit=crop",
    ],
    class: "11",
    subject: "Mathematics",
    board: "CBSE",
    format: "PDF",
    tags: ["NCERT", "JEE Mains"],
    badges: ["Best Seller"],
    inStock: true,
    stockCount: 200,
    rating: 4.9,
    reviews: 312,
    isBestSeller: true,
    isNew: false,
  },
  {
    id: "4",
    title: "Biology NEET Prep Guide",
    subtitle: "Class 11 & 12 Combined",
    description: "Comprehensive biology guide for NEET aspirants. Covers both Class 11 and 12 syllabus with MCQs.",
    price: 449,
    mrp: 799,
    discount: 44,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=1000&fit=crop",
    ],
    class: "11-12",
    subject: "Biology",
    board: "CBSE",
    format: "Physical",
    tags: ["NEET", "AIIMS"],
    badges: ["Limited Stock"],
    inStock: true,
    stockCount: 25,
    rating: 4.6,
    reviews: 189,
    isBestSeller: false,
    isNew: false,
  },
  {
    id: "5",
    title: "English Core Class 10",
    subtitle: "Literature + Grammar",
    description: "Complete English preparation with literature analysis, grammar exercises, and writing skills.",
    price: 199,
    mrp: 349,
    discount: 43,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=1000&fit=crop",
    ],
    class: "10",
    subject: "English",
    board: "CBSE",
    format: "PDF",
    tags: ["Board Exam"],
    badges: [],
    inStock: true,
    stockCount: 300,
    rating: 4.5,
    reviews: 98,
    isBestSeller: false,
    isNew: false,
  },
  {
    id: "6",
    title: "Social Science Class 9",
    subtitle: "History, Geography, Civics, Economics",
    description: "All four subjects in one comprehensive guide with maps, diagrams, and important dates.",
    price: 249,
    mrp: 399,
    discount: 38,
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=800&h=1000&fit=crop",
    ],
    class: "9",
    subject: "Social Science",
    board: "CBSE",
    format: "Combo",
    tags: ["Board Exam"],
    badges: ["New 2025 Edition"],
    inStock: true,
    stockCount: 175,
    rating: 4.7,
    reviews: 145,
    isBestSeller: false,
    isNew: true,
  },
  {
    id: "7",
    title: "Computer Science Class 12",
    subtitle: "Python Programming",
    description: "Complete Python programming guide with solved programs and SQL database concepts.",
    price: 329,
    mrp: 549,
    discount: 40,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=1000&fit=crop",
    ],
    class: "12",
    subject: "Computer Science",
    board: "CBSE",
    format: "PDF",
    tags: ["Programming", "Board Exam"],
    badges: ["Best Seller"],
    inStock: true,
    stockCount: 120,
    rating: 4.8,
    reviews: 201,
    isBestSeller: true,
    isNew: false,
  },
  {
    id: "8",
    title: "Hindi Class 10 Complete",
    subtitle: "Kritika + Kshitij + Grammar",
    description: "Complete Hindi preparation with literature explanation and grammar practice.",
    price: 179,
    mrp: 299,
    discount: 40,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=1000&fit=crop",
    ],
    class: "10",
    subject: "Hindi",
    board: "CBSE",
    format: "PDF",
    tags: ["Board Exam"],
    badges: [],
    inStock: true,
    stockCount: 250,
    rating: 4.4,
    reviews: 87,
    isBestSeller: false,
    isNew: false,
  },
];

export const categories: Category[] = [
  { id: "1", name: "Class 8", description: "Foundation building resources", icon: "📚", productCount: 12 },
  { id: "2", name: "Class 9", description: "Intermediate level preparation", icon: "📖", productCount: 18 },
  { id: "3", name: "Class 10", description: "Board exam preparation", icon: "📝", productCount: 24 },
  { id: "4", name: "Class 11", description: "Advanced concepts", icon: "🎯", productCount: 20 },
  { id: "5", name: "Class 12", description: "Final year mastery", icon: "🏆", productCount: 28 },
  { id: "6", name: "Competitive", description: "JEE, NEET & more", icon: "⚡", productCount: 15 },
];

export const mockUser: User = {
  id: "user-1",
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 98765 43210",
  referralCode: "CBSEGUY-RAHUL",
  totalOrders: 5,
  totalReferrals: 3,
  referralRewards: 150,
};

export const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-12-01",
    status: "Delivered",
    paymentStatus: "Verified",
    items: [
      { product: products[0], quantity: 1 },
      { product: products[2], quantity: 1 },
    ],
    total: 578,
    discount: 50,
    trackingLink: "https://track.example.com/123",
    courier: "BlueDart",
  },
  {
    id: "ORD-2024-002",
    date: "2024-12-05",
    status: "Pending",
    paymentStatus: "Pending",
    items: [
      { product: products[1], quantity: 2 },
    ],
    total: 698,
    discount: 0,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Order Confirmed",
    message: "Your order ORD-2024-001 has been confirmed and is being processed.",
    date: "2024-12-05",
    read: false,
  },
  {
    id: "2",
    type: "referral",
    title: "Referral Successful",
    message: "Your friend used your referral code! You earned ₹50 reward.",
    date: "2024-12-04",
    read: true,
  },
  {
    id: "3",
    type: "promo",
    title: "New Books Available",
    message: "Check out our latest 2025 edition books with exclusive discounts!",
    date: "2024-12-03",
    read: true,
  },
];

export const mockAddresses: Address[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "123 Main Street, Sector 15",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    isDefault: true,
  },
  {
    id: "2",
    name: "Rahul Sharma (Office)",
    phone: "+91 98765 43210",
    address: "456 Business Park, Block A",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122001",
    isDefault: false,
  },
];

export const subjects = ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Hindi", "Social Science", "Computer Science"];
export const classes = ["8", "9", "10", "11", "12", "11-12"];
export const boards = ["CBSE", "ICSE", "State Board"];
export const formats = ["PDF", "Physical", "Combo"];
