// Mock data for G4UltimateMobile CRM Prototype
const mockData = {
  // Feedback data
  feedback: {
    averageRating: 4.5,
    totalReviews: 128,
    recentFeedback: [
      {
        id: "FB001",
        rating: 5,
        topic: "support",
        text: "The customer support team was extremely helpful and resolved my issue quickly.",
        timestamp: "2025-03-15T14:30:00Z",
        user: "John D."
      },
      {
        id: "FB002",
        rating: 4,
        topic: "deals",
        text: "Good deals, but I wish there were more options for international plans.",
        timestamp: "2025-03-12T09:15:00Z",
        user: "Sarah M."
      },
      {
        id: "FB003",
        rating: 5,
        topic: "app",
        text: "The mobile app is very intuitive and easy to use. Love the new features!",
        timestamp: "2025-03-10T16:45:00Z",
        user: "Michael T."
      }
    ]
  },

  // User information
  userInfo: {
    id: "USR12345",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    accountNumber: "ACC987654321",
    accountType: "Premium",
    registrationDate: "2023-05-15",
    billingAddress: {
      street: "123 Main Street",
      city: "Anytown",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    }
  },

  // Package types for order form
  packageTypes: [
    { id: "mobile", name: "MobileOnly" },
    { id: "broadband", name: "BroadbandOnly" },
    { id: "tablet", name: "TabletOnly" }
  ],

  // Package options based on type
  packageOptions: {
    mobile: {
      phoneModels: [
        { id: "iphone13", name: "iPhone 13", price: 799.99 },
        { id: "galaxys21", name: "Samsung Galaxy S21", price: 699.99 },
        { id: "pixel6", name: "Google Pixel 6", price: 599.99 }
      ],
      addOns: [
        { id: "landline", name: "Landline minutes", price: 5.99 },
        { id: "international", name: "International minutes", price: 10.99 },
        { id: "08numbers", name: "08-number calls", price: 3.99 }
      ]
    },
    broadband: {
      routers: [
        { id: "basic", name: "Basic Router", price: 0 },
        { id: "premium", name: "Premium Router", price: 49.99 },
        { id: "mesh", name: "Mesh WiFi System", price: 149.99 }
      ]
    },
    tablet: {
      models: [
        { id: "ipad", name: "iPad 10.2", price: 329.99 },
        { id: "galaxytab", name: "Samsung Galaxy Tab", price: 249.99 },
        { id: "fireHD", name: "Amazon Fire HD", price: 149.99 }
      ],
      dataPlans: [
        { id: "5gb", name: "5GB Data", price: 15.99 },
        { id: "10gb", name: "10GB Data", price: 25.99 },
        { id: "unlimited", name: "Unlimited Data", price: 35.99 }
      ]
    }
  },

  // Promo codes
  promoCodes: [
    { code: "WELCOME10", discount: 0.1, description: "10% off for new customers" },
    { code: "LOYALTY25", discount: 0.25, description: "25% off for loyal customers" },
    { code: "SUMMER2025", discount: 0.15, description: "15% summer discount" }
  ],

  // Available packages
  packages: [
    {
      id: "PKG001",
      name: "Basic Mobile",
      description: "Essential mobile service with limited data",
      price: 29.99,
      features: [
        "Unlimited calls within network",
        "5GB data",
        "100 SMS messages",
        "No international roaming"
      ],
      popular: false
    },
    {
      id: "PKG002",
      name: "Standard Mobile",
      description: "Standard mobile service for everyday users",
      price: 49.99,
      features: [
        "Unlimited calls to all networks",
        "20GB data",
        "Unlimited SMS messages",
        "Limited international roaming"
      ],
      popular: true
    },
    {
      id: "PKG003",
      name: "Premium Mobile",
      description: "Premium mobile service for heavy users",
      price: 79.99,
      features: [
        "Unlimited calls to all networks",
        "Unlimited data",
        "Unlimited SMS messages",
        "Extensive international roaming",
        "Priority customer support"
      ],
      popular: false
    },
    {
      id: "PKG004",
      name: "Family Plan",
      description: "Shared plan for up to 5 family members",
      price: 99.99,
      features: [
        "Unlimited calls to all networks for all members",
        "50GB shared data",
        "Unlimited SMS messages",
        "Parental controls",
        "Family location tracking"
      ],
      popular: false
    }
  ],

  // Usage data
  usageData: {
    currentBillingCycle: {
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      dataUsed: 12.5, // GB
      dataTotal: 20, // GB
      callMinutesUsed: 320,
      callMinutesTotal: "Unlimited",
      smsUsed: 45,
      smsTotal: "Unlimited"
    },
    previousBillingCycles: [
      {
        period: "February 2025",
        dataUsed: 18.2,
        dataTotal: 20,
        callMinutesUsed: 450,
        smsUsed: 78
      },
      {
        period: "January 2025",
        dataUsed: 15.7,
        dataTotal: 20,
        callMinutesUsed: 380,
        smsUsed: 62
      }
    ]
  },

  // Support tickets
  supportTickets: [
    {
      id: "TKT001",
      subject: "Billing inquiry",
      status: "Open",
      createdDate: "2025-03-10",
      lastUpdated: "2025-03-10",
      priority: "Medium"
    },
    {
      id: "TKT002",
      subject: "Network connectivity issues",
      status: "Closed",
      createdDate: "2025-02-15",
      lastUpdated: "2025-02-18",
      priority: "High",
      resolution: "Resolved by network reset"
    }
  ],

  // Notifications
  notifications: [
    {
      id: "NTF001",
      type: "billing",
      message: "Your monthly bill of $49.99 is due in 5 days",
      date: "2025-03-25",
      read: false
    },
    {
      id: "NTF002",
      type: "promotion",
      message: "Special offer: Upgrade to Premium Mobile and get 3 months free!",
      date: "2025-03-20",
      read: true
    },
    {
      id: "NTF003",
      type: "usage",
      message: "You've used 80% of your monthly data allowance",
      date: "2025-03-22",
      read: false
    }
  ]
};

console.log("Mock data loaded successfully");
