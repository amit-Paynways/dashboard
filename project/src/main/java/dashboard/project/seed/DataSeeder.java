package dashboard.project.seed;

import dashboard.project.domain.AppUser;
import dashboard.project.domain.BankAccount;
import dashboard.project.domain.DashboardReport;
import dashboard.project.domain.HistoryEvent;
import dashboard.project.domain.Payment;
import dashboard.project.domain.Recipient;
import dashboard.project.repo.AppUserRepository;
import dashboard.project.repo.BankAccountRepository;
import dashboard.project.repo.HistoryEventRepository;
import dashboard.project.repo.PaymentRepository;
import dashboard.project.repo.RecipientRepository;
import dashboard.project.repo.ReportRepository;
import java.math.BigDecimal;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
  private final PaymentRepository payments;
  private final RecipientRepository recipients;
  private final BankAccountRepository bankAccounts;
  private final AppUserRepository users;
  private final ReportRepository reports;
  private final HistoryEventRepository history;

  public DataSeeder(
    PaymentRepository payments,
    RecipientRepository recipients,
    BankAccountRepository bankAccounts,
    AppUserRepository users,
    ReportRepository reports,
    HistoryEventRepository history
  ) {
    this.payments = payments;
    this.recipients = recipients;
    this.bankAccounts = bankAccounts;
    this.users = users;
    this.reports = reports;
    this.history = history;
  }

  @Override
  public void run(String... args) {
    seedUsers();
    seedRecipients();
    seedBankAccounts();
    seedPayments();
    seedReports();
    seedHistory();
  }

  private void seedUsers() {
    if (users.count() > 0) return;
    users.save(makeUser("AS", "Amit Singh", "amit.singh@example.com", AppUser.Role.ADMIN, AppUser.Status.ACTIVE, Instant.now()));
    users.save(makeUser("MR", "Maria Rodriguez", "maria.rodriguez@example.com", AppUser.Role.OPS, AppUser.Status.ACTIVE, Instant.now().minusSeconds(3600)));
    users.save(makeUser("JM", "Jorge Medina", "jorge.medina@example.com", AppUser.Role.COMPLIANCE, AppUser.Status.INVITED, Instant.now().minusSeconds(86_400)));
  }

  private static AppUser makeUser(String initials, String name, String email, AppUser.Role role, AppUser.Status status, Instant lastSeenAt) {
    AppUser u = new AppUser();
    u.setInitials(initials);
    u.setName(name);
    u.setEmail(email);
    u.setRole(role);
    u.setStatus(status);
    u.setLastSeenAt(lastSeenAt);
    return u;
  }

  private void seedRecipients() {
    if (recipients.count() > 0) return;
    recipients.save(makeRecipient("EG", "Exportadora Global SA", "ap@exportadora.example", "Mexico", "BBVA", Recipient.Status.ACTIVE));
    recipients.save(makeRecipient("GF", "Global Finance GmbH", "finance@globalfinance.example", "Germany", "Deutsche Bank", Recipient.Status.PENDING));
    recipients.save(makeRecipient("AC", "Acme Corp UK", "treasury@acme.example", "United Kingdom", "HSBC", Recipient.Status.BLOCKED));
  }

  private static Recipient makeRecipient(String initials, String name, String email, String country, String bank, Recipient.Status status) {
    Recipient r = new Recipient();
    r.setInitials(initials);
    r.setName(name);
    r.setEmail(email);
    r.setCountry(country);
    r.setBank(bank);
    r.setStatus(status);
    return r;
  }

  private void seedBankAccounts() {
    if (bankAccounts.count() > 0) return;
    bankAccounts.save(makeAccount("Operating Account - MXN", "**** 2190", "BBVA", "Mexico", "MXN", BankAccount.Status.ACTIVE));
    bankAccounts.save(makeAccount("Settlement Account - USD", "**** 0421", "Citi", "United States", "USD", BankAccount.Status.PENDING));
    bankAccounts.save(makeAccount("Reserve Account - EUR", "**** 3880", "Deutsche Bank", "Germany", "EUR", BankAccount.Status.DISABLED));
  }

  private static BankAccount makeAccount(String name, String masked, String bank, String country, String currency, BankAccount.Status status) {
    BankAccount a = new BankAccount();
    a.setName(name);
    a.setMasked(masked);
    a.setBank(bank);
    a.setCountry(country);
    a.setCurrency(currency);
    a.setStatus(status);
    return a;
  }

  private void seedPayments() {
    if (payments.count() > 0) return;
    payments.save(makePayment("REF-8821", Payment.Flow.OUTWARD, "TechSupply Inc.", "USA", "USD", new BigDecimal("14250"), Payment.Status.AWAITING_FUNDS, "SWIFT"));
    payments.save(makePayment("REF-8830", Payment.Flow.INWARD, "Grupo Distribuidora", "Mexico", "MXN", new BigDecimal("180000"), Payment.Status.SETTLED, "SPEI"));
    payments.save(makePayment("REF-8815", Payment.Flow.OUTWARD, "Muller Industrie", "Germany", "EUR", new BigDecimal("8200"), Payment.Status.IN_TRANSIT, "SWIFT"));
    payments.save(makePayment("REF-8899", Payment.Flow.OUTWARD, "Sharma Exports", "India", "USD", new BigDecimal("6400"), Payment.Status.INFO_REQUESTED, "SWIFT"));
  }

  private static Payment makePayment(
    String ref,
    Payment.Flow flow,
    String name,
    String country,
    String currency,
    BigDecimal amount,
    Payment.Status status,
    String via
  ) {
    Payment p = new Payment();
    p.setReference(ref);
    p.setFlow(flow);
    p.setCounterpartyName(name);
    p.setCounterpartyCountry(country);
    p.setCurrency(currency);
    p.setAmount(amount);
    p.setStatus(status);
    p.setVia(via);
    p.setValueAt(Instant.now());
    return p;
  }

  private void seedReports() {
    if (reports.count() > 0) return;
    reports.save(makeReport("Payments Summary", DashboardReport.Category.PAYMENTS, "This month", DashboardReport.Status.READY, "Amit Singh"));
    reports.save(makeReport("OFAC Screening Activity", DashboardReport.Category.COMPLIANCE, "Last 7 days", DashboardReport.Status.READY, "Jorge Medina"));
    reports.save(makeReport("Liquidity Position Snapshot", DashboardReport.Category.TREASURY, "Today", DashboardReport.Status.GENERATING, "Maria Rodriguez"));
  }

  private static DashboardReport makeReport(String name, DashboardReport.Category category, String period, DashboardReport.Status status, String owner) {
    DashboardReport r = new DashboardReport();
    r.setName(name);
    r.setCategory(category);
    r.setPeriod(period);
    r.setStatus(status);
    r.setOwner(owner);
    return r;
  }

  private void seedHistory() {
    if (history.count() > 0) return;
    history.save(makeHistory("Payment Released", "REF-8821 - Outward USD 14,250", HistoryEvent.Category.PAYMENTS, HistoryEvent.Outcome.SUCCESS, "Amit Singh"));
    history.save(makeHistory("OFAC Review Requested", "Global Finance GmbH - Potential Match", HistoryEvent.Category.COMPLIANCE, HistoryEvent.Outcome.WARNING, "Jorge Medina"));
    history.save(makeHistory("User Invited", "maria.rodriguez@example.com", HistoryEvent.Category.USERS, HistoryEvent.Outcome.SUCCESS, "Amit Singh"));
    history.save(makeHistory("Bank Account Disabled", "Operating Account - MXN (**** 2190)", HistoryEvent.Category.BANK_ACCOUNTS, HistoryEvent.Outcome.FAILED, "Amit Singh"));
  }

  private static HistoryEvent makeHistory(String event, String subject, HistoryEvent.Category cat, HistoryEvent.Outcome out, String actor) {
    HistoryEvent e = new HistoryEvent();
    e.setEvent(event);
    e.setSubject(subject);
    e.setCategory(cat);
    e.setOutcome(out);
    e.setActor(actor);
    e.setOccurredAt(Instant.now());
    return e;
  }
}

