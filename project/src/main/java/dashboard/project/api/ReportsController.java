package dashboard.project.api;

import dashboard.project.api.common.NotFoundException;
import dashboard.project.domain.DashboardReport;
import dashboard.project.repo.ReportRepository;
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
@RequestMapping("/api/reports")
public class ReportsController {
  private final ReportRepository repo;

  public ReportsController(ReportRepository repo) {
    this.repo = repo;
  }

  public record UpsertReportRequest(
    @NotBlank String name,
    DashboardReport.Category category,
    @NotBlank String period,
    DashboardReport.Status status,
    @NotBlank String owner
  ) {}

  @GetMapping
  public List<DashboardReport> list(@RequestParam(name = "q", required = false) String q) {
    String query = q == null ? "" : q.trim().toLowerCase();
    return repo.findAll().stream()
      .filter(r -> query.isEmpty()
        || r.getName().toLowerCase().contains(query)
        || r.getPeriod().toLowerCase().contains(query)
        || r.getOwner().toLowerCase().contains(query)
        || (r.getCategory() != null && r.getCategory().name().toLowerCase().contains(query)))
      .sorted(Comparator.comparing(DashboardReport::getUpdatedAt).reversed())
      .toList();
  }

  @GetMapping("{id}")
  public DashboardReport get(@PathVariable UUID id) {
    return repo.findById(id).orElseThrow(() -> new NotFoundException("Report not found"));
  }

  @PostMapping
  public DashboardReport create(@Valid @RequestBody UpsertReportRequest body) {
    DashboardReport r = new DashboardReport();
    apply(r, body);
    return repo.save(r);
  }

  @PutMapping("{id}")
  public DashboardReport update(@PathVariable UUID id, @Valid @RequestBody UpsertReportRequest body) {
    DashboardReport r = repo.findById(id).orElseThrow(() -> new NotFoundException("Report not found"));
    apply(r, body);
    return repo.save(r);
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable UUID id) {
    DashboardReport r = repo.findById(id).orElseThrow(() -> new NotFoundException("Report not found"));
    repo.delete(r);
  }

  private static void apply(DashboardReport r, UpsertReportRequest body) {
    r.setName(body.name());
    r.setCategory(body.category() == null ? DashboardReport.Category.PAYMENTS : body.category());
    r.setPeriod(body.period());
    r.setStatus(body.status() == null ? DashboardReport.Status.READY : body.status());
    r.setOwner(body.owner());
  }
}

