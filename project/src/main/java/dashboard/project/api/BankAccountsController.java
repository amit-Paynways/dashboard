package dashboard.project.api;

import dashboard.project.api.common.NotFoundException;
import dashboard.project.domain.BankAccount;
import dashboard.project.repo.BankAccountRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bank-accounts")
public class BankAccountsController {
  private final BankAccountRepository repo;

  public BankAccountsController(BankAccountRepository repo) {
    this.repo = repo;
  }

  public record UpsertBankAccountRequest(
    @NotBlank String name,
    @NotBlank String masked,
    @NotBlank String bank,
    @NotBlank String country,
    @NotBlank String currency,
    BankAccount.Status status
  ) {}

  @GetMapping
  public List<BankAccount> list(@RequestParam(name = "q", required = false) String q) {
    String query = q == null ? "" : q.trim().toLowerCase();
    return repo.findAll().stream()
      .filter(a -> query.isEmpty()
        || a.getName().toLowerCase().contains(query)
        || a.getMasked().toLowerCase().contains(query)
        || a.getBank().toLowerCase().contains(query)
        || a.getCountry().toLowerCase().contains(query)
        || a.getCurrency().toLowerCase().contains(query))
      .sorted(Comparator.comparing(BankAccount::getUpdatedAt).reversed())
      .toList();
  }

  @GetMapping("{id}")
  public BankAccount get(@PathVariable UUID id) {
    return repo.findById(id).orElseThrow(() -> new NotFoundException("Bank account not found"));
  }

  @PostMapping
  public BankAccount create(@Valid @RequestBody UpsertBankAccountRequest body) {
    BankAccount a = new BankAccount();
    apply(a, body);
    return repo.save(a);
  }

  @PutMapping("{id}")
  public BankAccount update(@PathVariable UUID id, @Valid @RequestBody UpsertBankAccountRequest body) {
    BankAccount a = repo.findById(id).orElseThrow(() -> new NotFoundException("Bank account not found"));
    apply(a, body);
    return repo.save(a);
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable UUID id) {
    BankAccount a = repo.findById(id).orElseThrow(() -> new NotFoundException("Bank account not found"));
    repo.delete(a);
  }

  private static void apply(BankAccount a, UpsertBankAccountRequest body) {
    a.setName(body.name());
    a.setMasked(body.masked());
    a.setBank(body.bank());
    a.setCountry(body.country());
    a.setCurrency(body.currency());
    a.setStatus(body.status() == null ? BankAccount.Status.ACTIVE : body.status());
  }
}

