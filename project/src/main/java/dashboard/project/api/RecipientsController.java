package dashboard.project.api;

import dashboard.project.api.common.NotFoundException;
import dashboard.project.domain.Recipient;
import dashboard.project.repo.RecipientRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
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
@RequestMapping("/api/recipients")
public class RecipientsController {
  private final RecipientRepository repo;

  public RecipientsController(RecipientRepository repo) {
    this.repo = repo;
  }

  public record UpsertRecipientRequest(
    @NotBlank String initials,
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotBlank String country,
    @NotBlank String bank,
    Recipient.Status status
  ) {}

  @GetMapping
  public List<Recipient> list(@RequestParam(name = "q", required = false) String q) {
    String query = q == null ? "" : q.trim().toLowerCase();
    return repo.findAll().stream()
      .filter(r -> query.isEmpty()
        || r.getName().toLowerCase().contains(query)
        || r.getEmail().toLowerCase().contains(query)
        || r.getCountry().toLowerCase().contains(query)
        || r.getBank().toLowerCase().contains(query))
      .sorted(Comparator.comparing(Recipient::getUpdatedAt).reversed())
      .toList();
  }

  @GetMapping("{id}")
  public Recipient get(@PathVariable UUID id) {
    return repo.findById(id).orElseThrow(() -> new NotFoundException("Recipient not found"));
  }

  @PostMapping
  public Recipient create(@Valid @RequestBody UpsertRecipientRequest body) {
    Recipient r = new Recipient();
    apply(r, body);
    return repo.save(r);
  }

  @PutMapping("{id}")
  public Recipient update(@PathVariable UUID id, @Valid @RequestBody UpsertRecipientRequest body) {
    Recipient r = repo.findById(id).orElseThrow(() -> new NotFoundException("Recipient not found"));
    apply(r, body);
    return repo.save(r);
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable UUID id) {
    Recipient r = repo.findById(id).orElseThrow(() -> new NotFoundException("Recipient not found"));
    repo.delete(r);
  }

  private static void apply(Recipient r, UpsertRecipientRequest body) {
    r.setInitials(body.initials());
    r.setName(body.name());
    r.setEmail(body.email());
    r.setCountry(body.country());
    r.setBank(body.bank());
    r.setStatus(body.status() == null ? Recipient.Status.ACTIVE : body.status());
  }
}

