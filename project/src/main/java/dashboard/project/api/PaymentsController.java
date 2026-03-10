package dashboard.project.api;

import dashboard.project.api.common.NotFoundException;
import dashboard.project.domain.Payment;
import dashboard.project.repo.PaymentRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
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
@RequestMapping("/api/payments")
public class PaymentsController {
  private final PaymentRepository repo;

  public PaymentsController(PaymentRepository repo) {
    this.repo = repo;
  }

  public record UpsertPaymentRequest(
    @NotBlank String reference,
    Payment.Flow flow,
    @NotBlank String counterpartyName,
    String counterpartyCountry,
    @NotBlank String currency,
    @NotNull BigDecimal amount,
    Payment.Status status,
    String via,
    Instant valueAt
  ) {}

  @GetMapping
  public List<Payment> list(
    @RequestParam(name = "q", required = false) String q,
    @RequestParam(name = "flow", required = false) Payment.Flow flow
  ) {
    String query = q == null ? "" : q.trim().toLowerCase();
    return repo.findAll().stream()
      .filter(p -> flow == null || p.getFlow() == flow)
      .filter(p -> query.isEmpty()
        || p.getReference().toLowerCase().contains(query)
        || p.getCounterpartyName().toLowerCase().contains(query)
        || (p.getCounterpartyCountry() != null && p.getCounterpartyCountry().toLowerCase().contains(query))
        || p.getCurrency().toLowerCase().contains(query)
        || (p.getStatus() != null && p.getStatus().name().toLowerCase().contains(query)))
      .sorted(Comparator.comparing(Payment::getUpdatedAt).reversed())
      .toList();
  }

  @GetMapping("{id}")
  public Payment get(@PathVariable UUID id) {
    return repo.findById(id).orElseThrow(() -> new NotFoundException("Payment not found"));
  }

  @PostMapping
  public Payment create(@Valid @RequestBody UpsertPaymentRequest body) {
    Payment p = new Payment();
    apply(p, body);
    return repo.save(p);
  }

  @PutMapping("{id}")
  public Payment update(@PathVariable UUID id, @Valid @RequestBody UpsertPaymentRequest body) {
    Payment p = repo.findById(id).orElseThrow(() -> new NotFoundException("Payment not found"));
    apply(p, body);
    return repo.save(p);
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable UUID id) {
    Payment p = repo.findById(id).orElseThrow(() -> new NotFoundException("Payment not found"));
    repo.delete(p);
  }

  private static void apply(Payment p, UpsertPaymentRequest body) {
    p.setReference(body.reference());
    p.setFlow(body.flow() == null ? Payment.Flow.OUTWARD : body.flow());
    p.setCounterpartyName(body.counterpartyName());
    p.setCounterpartyCountry(body.counterpartyCountry());
    p.setCurrency(body.currency());
    p.setAmount(body.amount());
    p.setStatus(body.status() == null ? Payment.Status.IN_TRANSIT : body.status());
    p.setVia(body.via());
    p.setValueAt(body.valueAt());
  }
}

