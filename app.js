/* =========================================================
   SupportAI - Customer Support Application
   Main JavaScript
   ========================================================= */

"use strict";

/* =========================================================
   DEMO DATA
   ========================================================= */

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    subject: "Order delivery update",
    preview: "Hi, could you tell me when my order will arrive?",
    time: "2 min ago",
    status: "open"
  },
  {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    subject: "Refund request",
    preview: "I would like to request a refund for my recent purchase.",
    time: "18 min ago",
    status: "pending"
  },
  {
    id: 3,
    name: "Emma Williams",
    initials: "EW",
    subject: "Unable to update address",
    preview: "The address update option isn't working for me.",
    time: "42 min ago",
    status: "open"
  },
  {
    id: 4,
    name: "David Brown",
    initials: "DB",
    subject: "Product information",
    preview: "Can you provide more information about this product?",
    time: "1 hr ago",
    status: "resolved"
  },
  {
    id: 5,
    name: "Olivia Davis",
    initials: "OD",
    subject: "Payment issue",
    preview: "My payment seems to have failed.",
    time: "2 hrs ago",
    status: "open"
  }
];

let tickets = [
  {
    id: "#1048",
    customer: "Sarah Johnson",
    subject: "Order delivery update",
    status: "Open",
    priority: "High"
  },
  {
    id: "#1047",
    customer: "Michael Chen",
    subject: "Refund request",
    status: "Pending",
    priority: "Medium"
  },
  {
    id: "#1046",
    customer: "Emma Williams",
    subject: "Address update problem",
    status: "Open",
    priority: "High"
  },
  {
    id: "#1045",
    customer: "David Brown",
    subject: "Product information",
    status: "Resolved",
    priority: "Low"
  }
];

const customers = [
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    plan: "Premium",
    tickets: 3,
    initials: "SJ"
  },
  {
    name: "Michael Chen",
    email: "michael@example.com",
    plan: "Basic",
    tickets: 2,
    initials: "MC"
  },
  {
    name: "Emma Williams",
    email: "emma@example.com",
    plan: "Premium",
    tickets: 5,
    initials: "EW"
  },
  {
    name: "David Brown",
    email: "david@example.com",
    plan: "Enterprise",
    tickets: 1,
    initials: "DB"
  },
  {
    name: "Olivia Davis",
    email: "olivia@example.com",
    plan: "Basic",
    tickets: 4,
    initials: "OD"
  },
  {
    name: "James Wilson",
    email: "james@example.com",
    plan: "Premium",
    tickets: 2,
    initials: "JW"
  }
];

const articles = [
  {
    title: "How to track an order",
    category: "Orders",
    views: 1240,
    updated: "Today"
  },
  {
    title: "How to request a refund",
    category: "Billing",
    views: 986,
    updated: "Yesterday"
  },
  {
    title: "Updating your shipping address",
    category: "Account",
    views: 743,
    updated: "2 days ago"
  },
  {
    title: "Payment troubleshooting",
    category: "Billing",
    views: 621,
    updated: "3 days ago"
  },
  {
    title: "Managing your account",
    category: "Account",
    views: 518,
    updated: "5 days ago"
  }
];

/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================================================
   PAGE TITLES
   ========================================================= */

const pageTitles = {
  dashboard: "Dashboard",
  inbox: "AI Inbox",
  tickets: "Tickets",
  customers: "Customers",
  knowledge: "Knowledge Base"
};

/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageName) {
  const pages = {
    dashboard: $("#dashboardPage"),
    inbox: $("#inboxPage"),
    tickets: $("#ticketsPage"),
    customers: $("#customersPage"),
    knowledge: $("#knowledgePage")
  };

  Object.values(pages).forEach((page) => {
    if (page) {
      page.classList.remove("active-page");
    }
  });

  if (pages[pageName]) {
    pages[pageName].classList.add("active-page");
  }

  $$(".nav-item").forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.page === pageName
    );
  });

  const title = $("#pageTitle");

  if (title) {
    title.textContent =
      pageTitles[pageName] || "Dashboard";
  }

  closeMobileMenu();
}

/* =========================================================
   CONVERSATION RENDERING
   ========================================================= */

function renderConversationItem(conversation) {
  return `
    <button
      class="conversation-item"
      data-conversation-id="${conversation.id}"
      type="button"
    >
      <div class="avatar">
        ${escapeHTML(conversation.initials)}
      </div>

      <div class="conversation-content">

        <div class="conversation-top">
          <strong class="conversation-name">
            ${escapeHTML(conversation.name)}
          </strong>

          <span class="conversation-time">
            ${escapeHTML(conversation.time)}
          </span>
        </div>

        <div class="conversation-subject">
          ${escapeHTML(conversation.subject)}
        </div>

        <div class="conversation-preview">
          ${escapeHTML(conversation.preview)}
        </div>

      </div>
    </button>
  `;
}

function renderDashboardConversations() {
  const container = $("#conversationList");

  if (!container) {
    return;
  }

  container.innerHTML = conversations
    .slice(0, 4)
    .map(renderConversationItem)
    .join("");
}

/* =========================================================
   INBOX
   ========================================================= */

function renderInbox() {
  const container = $("#inboxList");

  if (!container) {
    return;
  }

  container.innerHTML = conversations
    .map(renderConversationItem)
    .join("");
}

/* =========================================================
   CHAT
   ========================================================= */

const messageStore = {
  1: [
    {
      sender: "customer",
      text: "Hi, could you tell me when my order will arrive?"
    },
    {
      sender: "ai",
      text: "Of course! I can help you check the latest delivery information."
    }
  ],

  2: [
    {
      sender: "customer",
      text: "I would like to request a refund for my recent purchase."
    },
    {
      sender: "ai",
      text: "I can help with that. I'll need to check the order and refund eligibility."
    }
  ],

  3: [
    {
      sender: "customer",
      text: "The address update option isn't working for me."
    },
    {
      sender: "ai",
      text: "Sorry about that. I can help you troubleshoot the address update."
    }
  ]
};

function openConversation(id) {
  const conversation = conversations.find(
    (item) => item.id === Number(id)
  );

  if (!conversation) {
    return;
  }

  showPage("inbox");

  const customerName = $("#chatCustomerName");
  const customerMeta = $("#chatCustomerMeta");

  if (customerName) {
    customerName.textContent = conversation.name;
  }

  if (customerMeta) {
    customerMeta.textContent =
      `${conversation.subject} • ${conversation.time}`;
  }

  renderMessages(
    messageStore[conversation.id] || [
      {
        sender: "customer",
        text: conversation.preview
      }
    ]
  );
}

function renderMessages(messages) {
  const container = $("#messages");

  if (!container) {
    return;
  }

  container.innerHTML = messages
    .map((message) => {
      const isAI = message.sender === "ai";

      return `
        <div class="message ${isAI ? "message-ai" : "message-customer"}">
          <div class="message-bubble">
            ${escapeHTML(message.text)}
          </div>
        </div>
      `;
    })
    .join("");

  container.scrollTop = container.scrollHeight;
}

/* =========================================================
   DEMO AI RESPONSE
   ========================================================= */

function generateAIReply(text) {
  const message = text.toLowerCase();

  if (
    message.includes("order") ||
    message.includes("delivery") ||
    message.includes("track")
  ) {
    return "I'd be happy to help with your order. Please provide your order number so we can check the latest delivery status.";
  }

  if (
    message.includes("refund") ||
    message.includes("money back")
  ) {
    return "I can help with your refund request. Please provide your order number and I'll guide you through the next steps.";
  }

  if (
    message.includes("address") ||
    message.includes("shipping")
  ) {
    return "I can help update your shipping information. Please confirm the order number and the new address details.";
  }

  if (
    message.includes("payment") ||
    message.includes("paid")
  ) {
    return "I can help investigate the payment issue. Please share the order number or payment reference.";
  }

  if (
    message.includes("hello") ||
    message.includes("hi")
  ) {
    return "Hello! 👋 I'm your SupportAI assistant. How can I help you today?";
  }

  return "Thanks for reaching out. I can help with orders, refunds, payments, shipping, and account questions. Could you provide a little more detail?";
}

/* =========================================================
   MESSAGE FORM
   ========================================================= */

function setupMessageForm() {
  const form = $("#messageForm");
  const input = $("#messageInput");

  if (!form || !input) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) {
      return;
    }

    const container = $("#messages");

    if (!container) {
      return;
    }

    const userMessage = document.createElement("div");

    userMessage.className =
      "message message-customer";

    userMessage.innerHTML = `
      <div class="message-bubble">
        ${escapeHTML(text)}
      </div>
    `;

    container.appendChild(userMessage);

    input.value = "";

    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      const reply = document.createElement("div");

      reply.className =
        "message message-ai";

      reply.innerHTML = `
        <div class="message-bubble">
          ${escapeHTML(generateAIReply(text))}
        </div>
      `;

      container.appendChild(reply);

      container.scrollTop = container.scrollHeight;
    }, 600);
  });
}

/* =========================================================
   TICKETS
   ========================================================= */

function renderTickets() {
  const tableBody = $("#ticketTable");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = tickets
    .map((ticket) => `
      <tr>
        <td>
          <strong>${escapeHTML(ticket.id)}</strong>
        </td>

        <td>
          ${escapeHTML(ticket.customer)}
        </td>

        <td>
          ${escapeHTML(ticket.subject)}
        </td>

        <td>
          <span class="status status-${ticket.status.toLowerCase()}">
            ${escapeHTML(ticket.status)}
          </span>
        </td>

        <td>
          <span class="priority priority-${ticket.priority.toLowerCase()}">
            ${escapeHTML(ticket.priority)}
          </span>
        </td>
      </tr>
    `)
    .join("");

  updateOpenTicketCount();
}

function updateOpenTicketCount() {
  const element = $("#openTickets");

  if (!element) {
    return;
  }

  const openCount = tickets.filter(
    (ticket) =>
      ticket.status === "Open" ||
      ticket.status === "Pending"
  ).length;

  element.textContent = openCount;
}

/* =========================================================
   TICKET DIALOG
   ========================================================= */

function openTicketDialog() {
  const dialog = $("#ticketDialog");

  if (!dialog) {
    return;
  }

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeTicketDialog() {
  const dialog = $("#ticketDialog");

  if (!dialog) {
    return;
  }

  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

function setupTicketForm() {
  const form = $("#ticketForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const customer =
      $("#ticketCustomer")?.value.trim();

    const subject =
      $("#ticketSubject")?.value.trim();

    const priority =
      $("#ticketPriority")?.value || "Medium";

    const description =
      $("#ticketDescription")?.value.trim();

    if (!customer || !subject || !description) {
      alert("Please complete all required fields.");
      return;
    }

    const nextNumber =
      1049 + tickets.length - 4;

    tickets.unshift({
      id: `#${nextNumber}`,
      customer,
      subject,
      status: "Open",
      priority
    });

    renderTickets();

    form.reset();

    closeTicketDialog();

    showPage("tickets");

    alert("Ticket created successfully.");
  });
}

/* =========================================================
   CUSTOMERS
   ========================================================= */

function renderCustomers() {
  const container = $("#customerGrid");

  if (!container) {
    return;
  }

  container.innerHTML = customers
    .map((customer) => `
      <div class="customer-card">

        <div class="customer-avatar">
          ${escapeHTML(customer.initials)}
        </div>

        <div class="customer-info">

          <h3>
            ${escapeHTML(customer.name)}
          </h3>

          <p>
            ${escapeHTML(customer.email)}
          </p>

          <span class="customer-plan">
            ${escapeHTML(customer.plan)}
          </span>

        </div>

        <div class="customer-tickets">
          <strong>${customer.tickets}</strong>
          <span>tickets</span>
        </div>

      </div>
    `)
    .join("");
}

/* =========================================================
   KNOWLEDGE BASE
   ========================================================= */

function renderKnowledgeBase() {
  const container = $("#knowledgeList");

  if (!container) {
    return;
  }

  container.innerHTML = articles
    .map((article) => `
      <div class="knowledge-item">

        <div class="knowledge-icon">
          📚
        </div>

        <div class="knowledge-content">

          <h3>
            ${escapeHTML(article.title)}
          </h3>

          <p>
            ${escapeHTML(article.category)}
            • ${article.views.toLocaleString()} views
            • Updated ${escapeHTML(article.updated)}
          </p>

        </div>

        <button
          class="text-button"
          type="button"
          data-article="${escapeHTML(article.title)}"
        >
          View →
        </button>

      </div>
    `)
    .join("");
}

/* =========================================================
   SEARCH
   ========================================================= */

function searchSupport() {
  const query = prompt(
    "Search customers, tickets or conversations:"
  );

  if (!query || !query.trim()) {
    return;
  }

  const searchTerm = query.toLowerCase().trim();

  const results = [
    ...conversations.map((item) => ({
      type: "Conversation",
      name: item.name,
      text: `${item.subject} ${item.preview}`
    })),

    ...tickets.map((item) => ({
      type: "Ticket",
      name: item.customer,
      text: `${item.subject} ${item.status}`
    })),

    ...customers.map((item) => ({
      type: "Customer",
      name: item.name,
      text: `${item.email} ${item.plan}`
    }))
  ].filter((item) =>
    `${item.name} ${item.text}`
      .toLowerCase()
      .includes(searchTerm)
  );

  if (results.length === 0) {
    alert(`No results found for "${query}".`);
    return;
  }

  const resultText = results
    .slice(0, 8)
    .map(
      (result) =>
        `${result.type}: ${result.name}`
    )
    .join("\n");

  alert(
    `Search results for "${query}":\n\n${resultText}`
  );
}

/* =========================================================
   ASK AI
   ========================================================= */

function askAI() {
  const question = prompt(
    "What would you like the AI assistant to draft a reply for?"
  );

  if (!question || !question.trim()) {
    return;
  }

  const reply = generateAIReply(question);

  alert(
    `AI suggested reply:\n\n${reply}`
  );
}

/* =========================================================
   PROFILE
   ========================================================= */

function openProfile() {
  alert(
    "SupportAI Agent\n\nStatus: Online\nRole: Support Administrator"
  );
}

/* =========================================================
   MOBILE MENU
   ========================================================= */

function toggleMobileMenu() {
  const sidebar = $("#sidebar");

  if (!sidebar) {
    return;
  }

  sidebar.classList.toggle("mobile-open");
}

function closeMobileMenu() {
  const sidebar = $("#sidebar");

  if (!sidebar) {
    return;
  }

  sidebar.classList.remove("mobile-open");
}

/* =========================================================
   EVENT HANDLING
   ========================================================= */

function setupNavigation() {
  document.addEventListener("click", (event) => {
    const pageButton =
      event.target.closest("[data-page]");

    if (pageButton) {
      const pageName = pageButton.dataset.page;

      if (pageName) {
        showPage(pageName);
      }
    }

    const conversation =
      event.target.closest(
        "[data-conversation-id]"
      );

    if (conversation) {
      openConversation(
        conversation.dataset.conversationId
      );
    }

    const article =
      event.target.closest("[data-article]");

    if (article) {
      alert(
        `Knowledge article:\n\n${article.dataset.article}`
      );
    }
  });
}

/* =========================================================
   QUICK ACTIONS
   ========================================================= */

function setupButtons() {
  const newTicketButton =
    $("#newTicketButton");

  const quickTicketButton =
    $("#quickTicketButton");

  const askAIButton =
    $("#askAIButton");

  const searchButton =
    $("#searchButton");

  const profileButton =
    $("#profileButton");

  const mobileMenu =
    $("#mobileMenu");

  const closeTicket =
    $("#closeTicketDialog");

  if (newTicketButton) {
    newTicketButton.addEventListener(
      "click",
      openTicketDialog
    );
  }

  if (quickTicketButton) {
    quickTicketButton.addEventListener(
      "click",
      openTicketDialog
    );
  }

  if (askAIButton) {
    askAIButton.addEventListener(
      "click",
      askAI
    );
  }

  if (searchButton) {
    searchButton.addEventListener(
      "click",
      searchSupport
    );
  }

  if (profileButton) {
    profileButton.addEventListener(
      "click",
      openProfile
    );
  }

  if (mobileMenu) {
    mobileMenu.addEventListener(
      "click",
      toggleMobileMenu
    );
  }

  if (closeTicket) {
    closeTicket.addEventListener(
      "click",
      closeTicketDialog
    );
  }
}

/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"
