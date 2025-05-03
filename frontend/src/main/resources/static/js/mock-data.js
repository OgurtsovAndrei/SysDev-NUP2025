// Mock data for G4UltimateMobile CRM Prototype
const mockData = {
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