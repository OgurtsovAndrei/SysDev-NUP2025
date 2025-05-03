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
    packages: [
      {
        id: "PKG002",
        type: "mobile_combo",
        name: "Standard Mobile Plan",
        plan: "standard",
        addOns: ["Landline minutes", "International minutes"]
      },
      {
        id: "PKG005",
        type: "home_internet",
        name: "Home Internet",
        speed: "standard",
        router: "premium",
        addOns: ["Static IP", "Premium Support"]
      }
    ],
    paymentMethod: "**** **** **** 1234",
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
    { id: "home_internet", name: "Home Internet (limit only speed)" },
    { id: "mobile_hotspot", name: "Mobile Internet (with hotspot)" },
    { id: "mobile_no_hotspot", name: "Mobile Internet (no hotspot)" },
    { id: "mobile_combo", name: "Mobile Internet + Minutes + SMS" }
  ],

  // Package options based on type
  packageOptions: {
    home_internet: {
      speeds: [
        { id: "basic", name: "Basic (50 Mbps)", price: 29.99 },
        { id: "standard", name: "Standard (100 Mbps)", price: 49.99 },
        { id: "premium", name: "Premium (500 Mbps)", price: 79.99 },
        { id: "ultra", name: "Ultra (1 Gbps)", price: 99.99 }
      ],
      routers: [
        { id: "basic", name: "Basic Router", price: 0 },
        { id: "premium", name: "Premium Router", price: 49.99 },
        { id: "mesh", name: "Mesh WiFi System", price: 149.99 }
      ],
      addOns: [
        { id: "static_ip", name: "Static IP", price: 5.99 },
        { id: "premium_support", name: "Premium Support", price: 10.99 }
      ]
    },
    mobile_hotspot: {
      dataPlans: [
        { id: "10gb", name: "10GB Data", price: 15.99 },
        { id: "20gb", name: "20GB Data", price: 25.99 },
        { id: "50gb", name: "50GB Data", price: 45.99 },
        { id: "unlimited", name: "Unlimited Data", price: 65.99 }
      ],
      addOns: [
        { id: "international", name: "International Roaming", price: 10.99 },
        { id: "priority", name: "Priority Data", price: 15.99 }
      ]
    },
    mobile_no_hotspot: {
      dataPlans: [
        { id: "10gb", name: "10GB Data", price: 10.99 },
        { id: "20gb", name: "20GB Data", price: 20.99 },
        { id: "50gb", name: "50GB Data", price: 40.99 },
        { id: "unlimited", name: "Unlimited Data", price: 55.99 }
      ],
      addOns: [
        { id: "international", name: "International Roaming", price: 10.99 },
        { id: "priority", name: "Priority Data", price: 15.99 }
      ]
    },
    mobile_combo: {
      plans: [
        { id: "basic", name: "Basic (5GB + 100 mins + 100 SMS)", price: 19.99 },
        { id: "standard", name: "Standard (20GB + 500 mins + 500 SMS)", price: 39.99 },
        { id: "premium", name: "Premium (50GB + Unlimited mins + Unlimited SMS)", price: 59.99 },
        { id: "unlimited", name: "Unlimited (Unlimited Data + Unlimited mins + Unlimited SMS)", price: 79.99 }
      ],
      addOns: [
        { id: "landline", name: "Landline minutes", price: 5.99 },
        { id: "international", name: "International minutes", price: 10.99 },
        { id: "08numbers", name: "08-number calls", price: 3.99 },
        { id: "international_sms", name: "International SMS", price: 5.99 }
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
      packages: {
        "PKG002": {
          type: "mobile_combo",
          name: "Standard Mobile Plan",
          dataUsed: 12.5, // GB
          dataTotal: 20, // GB
          callMinutesUsed: 320,
          callMinutesTotal: 500,
          smsUsed: 45,
          smsTotal: 500,
          hotspotAllowed: false
        },
        "PKG005": {
          type: "home_internet",
          name: "Home Internet",
          dataUsed: 250.5, // GB
          dataTotal: 500, // GB
          downloadSpeed: "100 Mbps",
          uploadSpeed: "20 Mbps",
          devices: 8
        }
      }
    },
    previousBillingCycles: [
      {
        period: "February 2025",
        packages: {
          "PKG002": {
            type: "mobile_combo",
            name: "Standard Mobile Plan",
            dataUsed: 18.2,
            dataTotal: 20,
            callMinutesUsed: 450,
            callMinutesTotal: 500,
            smsUsed: 78,
            smsTotal: 500
          },
          "PKG005": {
            type: "home_internet",
            name: "Home Internet",
            dataUsed: 320.7,
            dataTotal: 500,
            downloadSpeed: "100 Mbps",
            uploadSpeed: "20 Mbps"
          }
        }
      },
      {
        period: "January 2025",
        packages: {
          "PKG002": {
            type: "mobile_combo",
            name: "Standard Mobile Plan",
            dataUsed: 15.7,
            dataTotal: 20,
            callMinutesUsed: 380,
            callMinutesTotal: 500,
            smsUsed: 62,
            smsTotal: 500
          },
          "PKG005": {
            type: "home_internet",
            name: "Home Internet",
            dataUsed: 280.3,
            dataTotal: 500,
            downloadSpeed: "100 Mbps",
            uploadSpeed: "20 Mbps"
          }
        }
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
