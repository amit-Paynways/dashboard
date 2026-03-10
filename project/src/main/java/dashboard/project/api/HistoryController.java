package dashboard.project.api;

import dashboard.project.api.common.NotFoundException;
import dashboard.project.domain.HistoryEvent;
import dashboard.project.repo.HistoryEventRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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
@RequestMapping("/api/history")
public class HistoryController {
  private final HistoryEventRepository repo;

  public HistoryController(HistoryEventRepository repo) {
    this.repo = repo;
  }

  public record UpsertHistoryRequest(
    @NotBlank String event,
    @NotBlank String subject,
    HistoryEvent.Category category,
    HistoryEvent.Outcome outcome,
    @NotBlank String actor,
    Instant occurredAt
  ) {}

  @GetMapping
  public List<HistoryEvent> list(@RequestParam(name = "q", required = false) String q) {
    String query = q == null ? "" : q.trim().toLowerCase();
    return repo.findAll().stream()
      .filter(e -> query.isEmpty()
        || e.getEvent().toLowerCase().contains(query)
        || e.getSubject().toLowerCase().contains(query)
        || e.getActor().toLowerCase().contains(query)
        || (e.getCategory() != null && e.getCategory().name().toLowerCase().contains(query)))
      .sorted(Comparator.comparing(HistoryEvent::getUpdatedAt).reversed())
      .toList();
  }

  @GetMapping("{id}")
  public HistoryEvent get(@PathVariable UUID id) {
    return repo.findById(id).orElseThrow(() -> new NotFoundException("History event not found"));
  }

  @PostMapping
  public HistoryEvent create(@Valid @RequestBody UpsertHistoryRequest body) {
    HistoryEvent e = new HistoryEvent();
    apply(e, body);
    return repo.save(e);
  }

  @PutMapping("{id}")
  public HistoryEvent update(@PathVariable UUID id, @Valid @RequestBody UpsertHistoryRequest body) {
    HistoryEvent e = repo.findById(id).orElseThrow(() -> new NotFoundException("History event not found"));
    apply(e, body);
    return repo.save(e);
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable UUID id) {
    HistoryEvent e = repo.findById(id).orElseThrow(() -> new NotFoundException("History event not found"));
    repo.delete(e);
  }

  private static void apply(HistoryEvent e, UpsertHistoryRequest body) {
    e.setEvent(body.event());
    e.setSubject(body.subject());
    e.setCategory(body.category() == null ? HistoryEvent.Category.PAYMENTS : body.category());
    e.setOutcome(body.outcome() == null ? HistoryEvent.Outcome.SUCCESS : body.outcome());
    e.setActor(body.actor());
    e.setOccurredAt(body.occurredAt() == null ? Instant.now() : body.occurredAt());
  }
}

